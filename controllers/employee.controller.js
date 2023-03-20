const Employee = require('../models/employee.model');

const fs = require('fs');

// to create tell the session the user is logged in
const authUtil = require('../util/authentication');

const validation = require('../util/validation');

// to save user entered input data
const sessionFlash = require('../util/session-flash');


async function getProfile(req, res, next) {

    // we get the session data saved
    let sessionData = sessionFlash.getSessionData(req);

    let employee;
    try {
        employee = await Employee.findById(req.session.userid);
        // if there's no session data saved we define the default data
        if (!sessionData) {
            // default data
            sessionData = {
                email: employee.email,
                name: employee.name,
                identification: employee.identification,
                role: employee.role,
                phoneNumber: employee.phoneNumber,
                contractStartDate: employee.contractStartDate,
                salary: employee.salary,
                theater: employee.theater,
            }
        }
        res.render('employee/profile', { employee: employee, inputData: sessionData });
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }
}

async function uploadPersonalInfo(req, res, next) {
    const enteredData = {
        email: req.body.email,
        name: req.body.name,
        identification: req.body.identification,
        phoneNumber: req.body['phone-number'],
    };

    if (
        !validation.employeePersonalInfoAreValid(
            req.body.email,
            req.body.name,
            req.body.identification,
            req.body['phone-number'],
        )
    ) {
        sessionFlash.flashDataToSession(
            req,
            {
                title: 'INVALID CREDENTIALS',
                errorMessage: 'Please check your input. No field can be left blank. Identification and Phone Number Card must be 10 characters.',
                // spread operator, so we save the user entered data (object created above)
                ...enteredData,
            },
            // once the data has been saved, we sent the request to reset the page
            function () {
                res.redirect('/employee/profile');
            }
        );
        return;
    }

    let employee;
    try {
        employee = await Employee.findById(req.session.userid);
    } catch (error) {
        next(error);
        return;
    }

    // we verify if there a new image to update
    //  just if the admin provides a new image for the movie we change it
    if (req.file) {
        // we delete the old movie image of the storage
        fs.unlink(employee.imagePath, (error) => {
            if (error) {
                console.log("The old employee image could not be deleted.");
                console.log(error);
            } else {
                console.log("Delete File successfully.");
            }
        });

        // replace the old image with the new one
        employee.replaceImage(req.file.filename);
    }

    // we get the user profile personal info updated and we update our client with the new data
    employee.updatePersonalInfo(req.body.email, req.body.name, req.body.identification, req.body['phone-number']);

    //  we save the updated client in the database
    try {
        await employee.save();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    res.redirect('/employee/profile');
}

async function updatePassword(req, res, next) {
    const enteredData = {
        email: req.body.email,
        name: req.body.name,
        identification: req.body.identification,
        phoneNumber: req.body['phone-number'],
    };
    if (!validation.passwordIsConfirmed(req.body.password, req.body['confirm-password'])) {
        sessionFlash.flashDataToSession(
            req,
            {
                title: 'PASSWORDS DO NOT MATCH',
                errorMessage: 'Please check your input. New password and the confirmation must match.',
                // spread operator, so we save the user entered data (object created above)
                ...enteredData,
            },
            // once the data has been saved, we sent the request to reset the page
            function () {
                res.redirect('/client/profile');
            }
        );
        return;
    }

    let employee;
    try {
        employee = await Employee.findById(req.session.userid);
    } catch (error) {
        next(error);
        return;
    }

    await employee.updatePassword(req.body['confirm-password']);

    //  we save the updated client in the database
    try {
        await employee.save();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    // we delete the user session
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}

module.exports = {
    getProfile: getProfile,
    uploadPersonalInfo: uploadPersonalInfo,
    updatePassword: updatePassword,
}