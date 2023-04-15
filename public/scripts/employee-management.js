const deleteEmployeeButtonElements = document.querySelectorAll('.table-item button');

async function deleteEmployee(event){
    const buttonElement = event.target;
    const employeeId = buttonElement.dataset.employeeid;
    const csrfToken = buttonElement.dataset.csrf;
    // sending the request to the url, and we configure the request
    const response = await fetch('/admin/employees/' + employeeId + '?_csrf=' + csrfToken, {
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

deleteEmployeeButtonElements.forEach(deleteEmployeeButtonElement => {
    deleteEmployeeButtonElement.addEventListener('click', deleteEmployee);
});

