const htmlElement = document;
const toastyElement = document.querySelector('#toasty');
const toastyAudio = new Audio('/media/sounds/toasty.mp3');
const time = '30000';
let activate = true;

function playAudio() {
    toastyElement.classList = 'activated';
    setTimeout(() => {
        toastyAudio.play();
    }, '100');
}

async function activateEasterEgg () {
    if (activate) {
        setTimeout(playAudio, time);
        setTimeout(() => {
            toastyElement.classList = '';
        }, '' + (+time + 900));
    }
}

htmlElement.addEventListener('click', () => {
    activateEasterEgg();
    activate = false;
});