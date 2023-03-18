const changePasswordBtn = document.querySelector('#container-password-form a');
const changePasswordInputsContainer = document.querySelector('#change-password-inputs-container');
const deleteAccountBtn = document.querySelector('#container-delete-account-form a');
const deleteAccountInputsContainer = document.querySelector('#delete-account-inputs-container');

function showPasswordUpdatingContainer(){
    changePasswordInputsContainer.style.display = 'block';
}

changePasswordBtn.addEventListener('click', showPasswordUpdatingContainer);


function showDeletingAccountContainer(){
    deleteAccountInputsContainer.style.display = 'block';
}

deleteAccountBtn.addEventListener('click', showDeletingAccountContainer);