const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');

function updateImagePreview() {
    const files = imagePickerElement.files;
    
    const pickedFile = files[0];

    imagePreviewElement.src = URL.createObjectURL(pickedFile);
    imagePreviewElement.style.display = 'block';
}

//  si es un documento para ingresar imagenes o solo mostrarlas
if(document.querySelector('#image-upload-control input')){
    imagePickerElement.addEventListener('change', updateImagePreview);
}