const test = require('node:test');
const assert = require('node:assert');

test('POST - Testing the succesfull signup - /tests/signup', { skip: ' ---- this is skipped ----' }, async () =>{
    const response = await fetch('http://localhost:3000/tests/signup', {
        // specifying the method
        method: 'POST',
        body: JSON.stringify({
            email: 'test@test.com',
            'confirm-email': 'test@test.com',
            password: 'test123',
            'confirm-password': 'test123',
            name: 'Test Test',
            identification: '1234567890',
        }),
        headers: {
            'Content-Type': 'application/json'
        }

    });
    const json = await response.json();
    console.log('response: ' + json.title);
    assert.equal(json.title, 'Signup Accepted', 'Signup is not Accepted');
});

test('POST - Testing emails doesn\'t match in signup - /tests/signup', { skip: ' ---- this is skipped ----' }, async () =>{
    const response = await fetch('http://localhost:3000/tests/signup', {
        // specifying the method
        method: 'POST',
        body: JSON.stringify({
            email: 'nicolas@gmail.com',
            'confirm-email': 'test@test.com',
            password: 'test123',
            'confirm-password': 'test123',
            name: 'Test Test',
            identification: '1234567890',
        }),
        headers: {
            'Content-Type': 'application/json'
        }

    });
    const json = await response.json();
    console.log('response: ' + json.title);
    assert.equal(json.title, 'Emails doesn\'t match', '');
});

test('POST - Testing signup duplicated - /tests/signup', { skip: ' ---- this is skipped ----' }, async () =>{
    const response = await fetch('http://localhost:3000/tests/signup', {
        // specifying the method
        method: 'POST',
        body: JSON.stringify({
            email: 'nicolas@gmail.com',
            'confirm-email': 'nicolas@gmail.com',
            password: 'test123',
            'confirm-password': 'test123',
            name: 'Test Test',
            identification: '1234567890',
        }),
        headers: {
            'Content-Type': 'application/json'
        }

    });
    const json = await response.json();
    console.log('response: ' + json.title);
    assert.equal(json.title, 'Duplicated User', '');
});