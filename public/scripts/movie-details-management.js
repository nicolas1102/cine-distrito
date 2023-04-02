const dateSelectElement = document.querySelector('#date-select');
const theaterSelectElement = document.querySelector('#theater-select');
const showtimeSelectElement = document.querySelector('#showtime-select');
const showtimeDivElement = document.querySelector('#showtime-selector');
const continueBtnElement = document.querySelector('.btn');

async function updateTheaters() {
    theaterSelectElement.parentElement.style.display = 'none';
    showtimeSelectElement.parentElement.style.display = 'none';
    continueBtnElement.parentElement.style.display = 'none';

    const date = dateSelectElement.value;
    const csrfToken = showtimeDivElement.dataset.csrf;

    let response;
    try {
        response = await fetch(`/movies/shows/theaters/${date}`, {
            method: 'POST',
            body: JSON.stringify({
                _csrf: csrfToken,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }

    // we parse the response from json format to js code
    const responseData = await response.json();
    const theaters = [...responseData.theaters];

    // deleting previous theater options
    for (let i = (theaterSelectElement.options.length - 1); i >= 1; i--) {
        theaterSelectElement.remove(i);
    }

    // creating the new theater options
    let option = document.createElement("option");
    option.value = '0';
    option.text = '--Please choose a Theater--';
    option.selected = true;
    option.disabled = true;
    option.hidden = true;
    theaterSelectElement.appendChild(option);
    
    theaters.forEach(theater => {
        let option = document.createElement("option");
        option.value = theater._id;
        option.text = theater.name;
        theaterSelectElement.appendChild(option);
    });

    theaterSelectElement.parentElement.style.display = 'block';
}

async function updateShowtimes() {
    showtimeSelectElement.parentElement.style.display = 'none';
    continueBtnElement.parentElement.style.display = 'none';

    const date = dateSelectElement.value;
    const theaterId = theaterSelectElement.value;
    const csrfToken = showtimeDivElement.dataset.csrf;

    let response;
    try {
        response = await fetch(`/movies/shows/showtimes/${theaterId}`, {
            method: 'POST',
            body: JSON.stringify({
                date: date,
                _csrf: csrfToken,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }

    // we parse the response from json format to js code
    const responseData = await response.json();
    const shows = [...responseData.shows];

    // deleting previous showtime options
    for (let i = (showtimeSelectElement.options.length - 1); i >= 1; i--) {
        showtimeSelectElement.remove(i);
    }

    // creating the new showtime options
    let option = document.createElement("option");
    option.value = '0';
    option.text = '--Please choose a Showtime--';
    option.selected = true;
    option.disabled = true;
    option.hidden = true;
    showtimeSelectElement.appendChild(option);

    shows.forEach(show => {
        let option = document.createElement("option");
        option.value = show.id;
        option.text = show.time;
        showtimeSelectElement.appendChild(option);
    });

    showtimeSelectElement.parentElement.style.display = 'block';
}

function showBtn() {
    continueBtnElement.parentElement.style.display = 'flex';
}

dateSelectElement.addEventListener('change', updateTheaters);
theaterSelectElement.addEventListener('change', updateShowtimes);
showtimeSelectElement.addEventListener('change', showBtn);