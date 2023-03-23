const updateOrderFormElements = document.querySelectorAll(
    '.order-actions #update-order-form'
);
const deleteOrderFormElements = document.querySelectorAll(
    '.order-actions #delete-order-form'
);

async function updateOrder(event) {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData(form);
    const newStatus = formData.get('status');
    const orderId = formData.get('orderid');
    const csrfToken = formData.get('_csrf');

    let response;
    try {
        response = await fetch(`/admin/orders/${orderId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                newStatus: newStatus,
                _csrf: csrfToken,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        alert('Something went wrong - could not update order status.');
        return;
    }

    if (!response.ok) {
        alert('Something went wrong - could not update order status.');
        return;
    }

    const responseData = await response.json();

    form.parentElement.parentElement.querySelector('.badge').textContent =
        responseData.newStatus.toUpperCase();
}

for (const updateOrderFormElement of updateOrderFormElements) {
    updateOrderFormElement.addEventListener('submit', updateOrder);
}

async function deleteOrder(event) {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData(form);
    const orderId = formData.get('orderid');
    const csrfToken = formData.get('_csrf');

    let response;
    try {
        response = await fetch(`/admin/orders/${orderId}?_csrf=${csrfToken}`, {
            method: 'DELETE',
        });
    } catch (error) {
        alert('Something went wrong - could not delete the order.');
        return;
    }

    if (!response.ok) {
        alert('Something went wrong - could not delete the order.');
        return;
    }

    // removing the item form the DOM 
    form.parentElement.parentElement.remove();
}

for (const deleteOrderFormElement of deleteOrderFormElements) {
    deleteOrderFormElement.addEventListener('submit', deleteOrder);
}
