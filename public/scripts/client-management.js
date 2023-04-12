const deleteClientButtonElements = document.querySelectorAll('.table-item button');

async function deleteClient(event){
    const buttonElement = event.target;
    const clientId = buttonElement.dataset.clientid;
    const csrfToken = buttonElement.dataset.csrf;
    // sending the request to the url, and we configure the request
    const response = await fetch('/admin/clients/' + clientId + '?_csrf=' + csrfToken, {
        // specifying the method
        method: 'DELETE',
    });
    if(!response.ok){
        alert('Something went wrong!');
        return;
    }

    // removing the item form the DOM (accessing to the li element of the products-grid ul)
    buttonElement.parentElement.parentElement.remove();
}

deleteClientButtonElements.forEach(deleteClientButtonElement => {
    deleteClientButtonElement.addEventListener('click', deleteClient);
});

