const test = require('node:test');
const assert = require('node:assert');

test('POST - Testing the succesfull login - /tests/login', { skip: ' ---- this is skipped ----' }, async () =>{
    const response = await fetch('http://localhost:3000/tests/login', {
        method: 'POST',
        body: JSON.stringify({
            email: 'test@test.com',
            password: 'test123',
        }),
        headers: {
            'Content-Type': 'application/json'
        }

    });
    const json = await response.json();
    console.log('response: ' + json.title);
    assert.equal(json.title, 'Login Accepted', 'Login is not Accepted');
});

test('POST - Testing user don\'t found - /tests/login', { skip: ' ---- this is skipped ----' }, async () =>{
    const response = await fetch('http://localhost:3000/tests/login', {
        method: 'POST',
        body: JSON.stringify({
            email: 'notfound@test.com',
            password: 'test123',
        }),
        headers: {
            'Content-Type': 'application/json'
        }

    });
    const json = await response.json();
    console.log('response: ' + json.title);
    assert.equal(json.title, 'User don\'t exist', '');
});

test('POST - Testing signup duplicated - /tests/login', async () =>{
    const response = await fetch('http://localhost:3000/tests/login', {
        method: 'POST',
        body: JSON.stringify({
            email: 'test@test.com',
            password: 'test1234',
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const json = await response.json();
    console.log('response: ' + json.title);
    assert.equal(json.title, 'Invalid credentials', '');
});