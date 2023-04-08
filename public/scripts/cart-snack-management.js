const addToCartButtonElements = document.querySelectorAll('.product-item-actions #add-to-cart');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function addToCart(event) {
    // the element which make the event ocurred
    const addToCartButtonElement = event.target;
    // we extract data saved in datased of the button element
    const productId = addToCartButtonElement.dataset.productid;
    const producttype = addToCartButtonElement.dataset.producttype;
    const csrfToken = addToCartButtonElement.dataset.csrf;

    // RECTIFICAMOS PRIMERO LA DISPONIBILIDAD DE LA CANTIDAD DEL PRODUCTO
    // sending the request to the url, and we configure the request
    // const responseQuantityOfProduct = await fetch('/cart/items/snack/' + productId + '?_csrf=' + csrfToken, {
    //     // specifying the method
    //     method: 'POST',
    //     body: JSON.stringify({
    //         quantity: quantity,
    //         type: producttype,
    //         _csrf: csrfToken,
    //     }),
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // });
    // if(!responseQuantityOfProduct.ok){
    //     alert('Something went wrong!');
    //     return;
    // }
    // // we parse the response from json format to js code
    // const responseQuantityData = await responseQuantityOfProduct.json();
    // if (responseQuantityData.exceededQuantity) {
    //     alert(responseQuantityData.message);
    //     return;
    // }


    // we build our response to send it to the server
    let response;
    try {
        // wait the response of the server in the next route
        response = await fetch('/cart/items/snack', {
            method: 'POST',
            // we convert an object in json format; this is the body we are going to use in the cart controller
            body: JSON.stringify({
                productId: productId,
                type: producttype,
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

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    // we parse the response from json format to js code
    const responseData = await response.json();

    const newTotalQuantity = responseData.newTotalItems;

    cartBadgeElements.forEach(cartBadgeElement => {
        cartBadgeElement.textContent = newTotalQuantity;
    });
}

addToCartButtonElements.forEach(addToCartButtonElement => {
    addToCartButtonElement.addEventListener('click', addToCart);
});