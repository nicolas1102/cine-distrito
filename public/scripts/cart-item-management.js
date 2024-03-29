const cartItemUpdateFormElements = document.querySelectorAll(
    '.cart-item-management'
);
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartTotalPointsElement = document.getElementById('cart-total-points');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');
const buyButton = document.querySelector('#buy-btn');

async function updateCartItem(event) {
    event.preventDefault();

    const form = event.target;

    const productId = form.dataset.productid;
    // const producttype = form.dataset.producttype;
    const csrfToken = form.dataset.csrf;
    //  we access to the quantity of the item in the cart
    const quantity = form.firstElementChild.value;

    let response;
    try {
        response = await fetch('/cart/items/snack', {
            method: 'PATCH',
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                _csrf: csrfToken,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    const responseData = await response.json();

    // we remove the item if the price is 0
    if (responseData.updatedCartData.updatedItemPrice === 0) {
        form.parentElement.parentElement.remove();
        //  if the price is not 0, we are updating it
    } else {
        const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price');
        cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice;
    }

    if (buyButton && cartItemUpdateFormElements.length === 1) {
        buyButton.style.display = 'none';
    }
    cartTotalPointsElement.textContent = responseData.updatedCartData.newTotalPoints;
    cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice;


    cartBadgeElements.forEach(cartBadgeElement => {
        cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
    });
}

cartItemUpdateFormElements.forEach(cartItemUpdateFormElement => {
    cartItemUpdateFormElement.addEventListener('submit', updateCartItem);
});