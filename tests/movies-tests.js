const test = require('node:test');
const assert = require('node:assert');

test('Getting all movies', { skip: ' ---- this is skipped ----' }, async () =>{
    const response = await fetch('http://localhost:3000/tests/all-movies', {
        // specifying the method
        method: 'GET',
    });
    const json = await response.json();
    console.log(json.movies);
});