let link = document.querySelector('.login');
let popup = document.querySelector('footer + .substrate');
let close = popup.querySelector('.close');


link.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.add("modal-block");
});

close.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.remove("modal-block");
});

//=============map-popup============================================

let writeUs = document.querySelector('.map-open');
let map = document.querySelector('.info .substrate');
let closeMap = map.querySelector('.close-map');

writeUs.addEventListener('click', function (par) {
    par.preventDefault();
    map.classList.add('modal-map-block');
});

closeMap.addEventListener('click', function (par) {
    par.preventDefault();
    map.classList.remove('modal-map-block');
});
