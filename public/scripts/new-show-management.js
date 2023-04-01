const theaterSelectElement = document.querySelector('#theater-select');
const showFormElement = document.querySelector('.form');
const screenSelectElement = document.querySelector('#screen');

async function updateNumberScreens() {
    // we get the data of the button in the item
    const theaterId = theaterSelectElement.value;
    // getting the crsf token we save in the item, we need that 'cause the csrf protection that has our server side controls the requests the client side sends
    const csrfToken = showFormElement.dataset.csrf;

    // sending the request to the url, and we configure the request
    let response
    try {
        response = await fetch('/admin/theaters/screens/' + theaterId, {
            // specifying the method
            method: 'POST',
            // we convert an object in json format; this is the body we are going to use in the cart controller
            body: JSON.stringify({
                theaterId: theaterId,
                // we need to add the token if it is not a GET request
                _csrf: csrfToken,
            }),
            // adding our own metadata; we describe the type of data we sent, so the server know how to parse the data
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }

    // we parse the response from json format to js code
    const responseData = await response.json();

    // deleting previous options
    for (let i = (screenSelectElement.options.length - 1); i >= 0; i--) {
        screenSelectElement.remove(i);
    }

    // creating the new options
    for (let i = 1; i <= responseData.numScreens; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        screenSelectElement.appendChild(option);
    }

}

theaterSelectElement.addEventListener('change', updateNumberScreens);