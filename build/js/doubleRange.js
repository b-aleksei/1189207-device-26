// double range
(function () {

	// for IE11
	const supportsTemplate = 'content' in document.createElement('template');
// the function takes a template and returns a DOM element
	const createElement = supportsTemplate
		? function (html) {
			const template = document.createElement('template');
			template.innerHTML = html;
			return template.content.firstElementChild;
		}
		: function (html) {
			const div = document.createElement('div');
			div.innerHTML = html;
			return div.firstElementChild;
		};

	const data = {
		contClass: 'price',
		min: 0,
		max: 10000,
		step: 100,
		valueMin: 0,
		valueMax: 5000,
		nameMin: 'minPrice',
		nameMax: 'maxPrice'
	};

	const createDoubleRange = function (param = {}) {
		const { contClass, min, max, step, valueMin, valueMax, nameMin, nameMax } = param;

		return `
<div class="double-range ${contClass}">
							<h3 class="font-bold">Стоимость</h3>
		<span
			class="double-range__track"
		></span>
	
		<label class="double-range__label" aria-label="Стоимость от">
			<input
				class="
					double-range__input
					double-range__input--from"
				type="range"
				min="${min}"
				max="${max}"
				step="${step}"
				value="${valueMin}"
				name="${nameMin}"
				data-key="from"
			>
			<span
				class="
					double-range__thumb
					double-range__thumb--from"
				data-key="from"
			></span>
		</label>

		<label class="double-range__label" aria-label="Стоимость до">
			<input
				class="
					double-range__input
					double-range__input--to"
				type="range"
				min="${min}"
				max="${max}"
				step="${step}"
				value="${valueMax}"
				name="${nameMax}"
				data-key="to"
			>
			<span
				class="
					double-range__thumb
					double-range__thumb--to"
				data-key="to"
			></span>
		</label>
					<span class="cost">от <span class="double-range__output double-range__output--from">0</span></span>
							<span>до <span class="double-range__output double-range__output--to">5000</span></span>
</div>
`;
	};

	const tmpl = createDoubleRange(data);

	class DoubleRange {
		constructor (elemPlaceholder) {
			this.render(elemPlaceholder);

			this.thumbs = {
				from: this.elem.querySelector('.double-range__thumb--from'),
				to: this.elem.querySelector('.double-range__thumb--to')
			};

			this.inputs = {
				from: this.elem.querySelector('.double-range__input--from'),
				to: this.elem.querySelector('.double-range__input--to')
			};

			this.values = {
				from: this.elem.querySelector('.double-range__output--from'),
				to: this.elem.querySelector('.double-range__output--to')
			};

			this.indicator = {
				track: this.elem.querySelector('.double-range__track'),
				startFill: 0,
				endFill: 0
			}

			this.eventNames = {
				pointerdown: 'pointerdown',
				pointerup: 'pointerup',
				pointermove: 'pointermove'
			}

			if (!window.PointerEvent) {
				this.eventNames.pointerdown = 'mousedown'
				this.eventNames.pointerup = 'mouseup'
				this.eventNames.pointermove = 'mousemove'
			}

			this.currentKey = null;
			this.shift = null;
			this.thumbsWidth = null;
			// Assume both inputs have equal max values on start
			this.maxValue = this.inputs.to.max;
			// Use form to check reset
			this.form = this.elem.closest('form');

			this.setThumbPosition = this.setThumbPosition.bind(this);
			this.pointerDown = this.pointerDown.bind(this);
			this.moveThumb = this.moveThumb.bind(this);
			this.stopDrag = this.stopDrag.bind(this);

			this.init();
		}

		get rightEdge () {
			return this.elem.offsetWidth - this.thumbsWidth;
		}

		// replace template from js to html
		render (elemPlaceholder) {
			this.elem = createElement(tmpl);
			elemPlaceholder.replaceWith(this.elem);
		}

		init () {
			this.thumbsWidth = this.thumbs.from.offsetWidth;
			this.addEvents();
			this.setThumbPosition();
		}

		setThumbPosition (params = {}) {
			const { inputKey } = params;
			const reset = !inputKey;

			for (const key in this.thumbs) {
				if (!reset) {
					if (inputKey !== key) {
						continue;
					}
				}

				const input = this.inputs[key];
				const inputValue = +input.value;
				const thumb = this.thumbs[key];
				const valueElem = this.values[key];

				// Glass wall for inputs
				if (key === 'from') {
					const compareTo = this.inputs.to;
					const compareToValue = +compareTo.value;

					if (inputValue >= compareToValue) {
						input.value = compareToValue - Number(input.step);
					}
				} else {
					const compareTo = this.inputs.from;
					const compareToValue = +compareTo.value;

					if (inputValue <= compareToValue) {
						input.value = compareToValue + Number(input.step);
					}
				}

				// Set thumb position
				const value = input.value || input.defaultValue;
				let left = value / this.maxValue * this.rightEdge;
				left = left.toFixed() + 'px'
				thumb.style.left = left;

				// Set label texts
				valueElem.style.left = left;
				valueElem.innerHTML = value;

				key === 'from' ? this.indicator.startFill = left : this.indicator.endFill = left
			}
			// set color between thumbs
			this.indicator.track.style.backgroundImage = `linear-gradient(90deg, transparent ${this.indicator.startFill},
		 currentColor ${this.indicator.startFill} ${this.indicator.endFill}, transparent ${this.indicator.endFill})`
		}

		// Events

		addEvents () {
			for (const key in this.inputs) {
				const input = this.inputs[key];
				const thumb = this.thumbs[key];

				thumb.ondragstart = () => false;

				input.addEventListener('input', () => {
					this.setThumbPosition({ inputKey: key });
				});
			}

			this.elem.addEventListener(this.eventNames.pointerdown, this.pointerDown);
			window.addEventListener('resize', this.setThumbPosition);
			this.form.addEventListener('reset', () => {
				setTimeout(this.setThumbPosition);
			});
		}

		pointerDown (e) {
			const key = e.target.dataset.key;
			if (!key) {
				return;
			}
			e.preventDefault();
			const current = this.thumbs[key];
			this.currentKey = key;

			current.setPointerCapture(e.pointerId);
			this.shift = e.clientX - current.offsetLeft;

			this.elem.addEventListener(this.eventNames.pointermove, this.moveThumb);
			this.elem.addEventListener(this.eventNames.pointerup, this.stopDrag);
		}

		moveThumb (e) {
			const left = e.clientX - this.shift;
			const key = this.currentKey;
			const value = left / this.rightEdge * this.maxValue;

			this.inputs[key].value = value;
			this.inputs[key].focus();
			this.inputs[key].dispatchEvent(new Event('input'));
		}

		stopDrag () {
			this.elem.removeEventListener(this.eventNames.pointermove, this.moveThumb);
			this.elem.removeEventListener(this.eventNames.pointerup, this.stopDrag);
		}
	}

// Using
	const doubleRangeElem = document.querySelector('.double-range');

	if (doubleRangeElem instanceof HTMLElement) {
		new DoubleRange(doubleRangeElem);
	}

})();
