let link = document.querySelector('.login');
let popup = document.querySelector('footer + .substrate');
let close = popup.querySelector('.close');
let form = popup.querySelector("form");
let login = popup.querySelector("[name=login]");
let email = popup.querySelector("[name=email]");
let isStorageSupport = true;
let storage = "";

try {
    storage = localStorage.getItem("login");
} catch (err) {
    isStorageSupport = false;
}

link.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.add("modal-block");
    if (storage) {
        login.value = storage;
        email.focus();
    } else {
        login.focus();
    }
});

close.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.remove("modal-block");
    popup.classList.remove("modal-error");
});

/*
popup.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.remove("modal-block");
    popup.classList.remove("modal-error");
});
*/

form.addEventListener("submit", function (evt) {
    if (!login.value || !email.value) {
        evt.preventDefault();
        popup.classList.remove("modal-error");
        // noinspection SillyAssignmentJS
        popup.offsetWidth = popup.offsetWidth;
        popup.classList.add("modal-error");
    } else {
        if (isStorageSupport) {
            localStorage.setItem("login", login.value);
        }
    }
});

window.addEventListener("keydown", function (evt) {
    // noinspection JSDeprecatedSymbols
    if (evt.keyCode === 27) {
        evt.preventDefault();
        if (popup.classList.contains("modal-show")) {
            popup.classList.remove("modal-show");
            popup.classList.remove("modal-error");
        }
    }
});

//=============map-popup============================================

let mapOpen = document.querySelector('.map-open');
let map = document.querySelector('.info .substrate');
let closeMap = map.querySelector('.close-map');

mapOpen.addEventListener('click', function (par) {
    par.preventDefault();
    map.classList.add('modal-map-block');
});

closeMap.addEventListener('click', function (par) {
    par.preventDefault();
    map.classList.remove('modal-map-block');
});
map.addEventListener('click', function (par) {
    par.preventDefault();
    map.classList.remove('modal-map-block');
});
// ========================================================================


/*
let imgObj = document.getElementById('image-2');
function gray(imgObj) {
    let canvas = document.createElement('canvas');
    let canvasContext = canvas.getContext('2d');

    let imgW = imgObj.width;
    let imgH = imgObj.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext.drawImage(imgObj, 0, 0);
    let imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    for(let y = 0; y < imgPixels.height; y++){
        for(let x = 0; x < imgPixels.width; x++){
            let i = (y * 4) * imgPixels.width + x * 4;
            let avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;
        }
    }
    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
}
imgObj.src = gray(imgObj);*/
