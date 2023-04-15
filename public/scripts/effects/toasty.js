const htmlElement = document;
const toastyElement = document.querySelector('#toasty');
const toastyAudio = new Audio('/media/sounds/toasty.mp3');
const time = '3000';

function playAudio() {
    toastyElement.classList = 'activated';
    setTimeout(() => {
        toastyAudio.play();
    }, '400');
}

async function activateEasterEgg () {
    setTimeout(playAudio, time);
    
    setTimeout(() => {
        toastyElement.classList = '';
    }, '' + (+time + 1000));
}

htmlElement.addEventListener('click', activateEasterEgg);