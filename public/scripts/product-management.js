// const deleteMovieButtonElements = document.querySelectorAll('.movie-item button');

// async function deleteMovie(event){
//     // the element which make the event ocurred
//     const buttonElement = event.target;
//     // we get the data of the button in the item
//     const movieId = buttonElement.dataset.movieid;
//     // getting the crsf token we save in the item, we need that 'cause the csrf protection that has our server side controls the requests the client side sends
//     const csrfToken = buttonElement.dataset.csrf;

//     // sending the request to the url, and we configure the request
//     const response = await fetch('/admin/movies/' + movieId + '?_csrf=' + csrfToken, {
//         // specifying the method
//         method: 'DELETE',
//     });

//     if(!response.ok){
//         alert('Something went wrong!');
//         return;
//     }

//     // removing the item form the DOM (accessing to the li element of the products-grid ul)
//     buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
// }

// deleteMovieButtonElements.forEach(deleteMovieButtonElement => {
//     deleteMovieButtonElement.addEventListener('click', deleteMovie);
// });

