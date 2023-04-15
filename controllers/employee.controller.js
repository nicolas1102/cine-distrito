const Employee = require('../models/employee.model');
const Ticket = require('../models/ticket.model');
const Snack = require('../models/snack.model');
const Order = require('../models/order.model');

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
                position: employee.position,
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



async function getEmployeeOrderPayment(req, res, next) {
    const cart = res.locals.cart;

    // rectifying products
    const unavailableProducts = [];
    for (let i = 0; i < cart.items.length; i++) {
        if (cart.items[i].product.type === 'Ticket') {
            const ticket = await Ticket.findByPositionAndShow(cart.items[i].product.rowChair, cart.items[i].product.columnChair, cart.items[i].product.isPreferencial, cart.items[i].product.show._id, false);
            if (ticket) {
                let show;
                try {
                    show = await Show.findById(ticket.showId);
                } catch (error) {
                    next(error);
                }
                unavailableProducts.push(ticket.product.name + ' - ' + show.movie.title + ' - ' + new Date(show.date).toDateString() + ', ' + show.time + ' - ' + String.fromCharCode(97 + (+ticket.rowChair)).toUpperCase() + ticket.columnChair);
            }
        } else {
            const snack = await Snack.findById(cart.items[i].product.snackId, false);
            if (snack && (+cart.items[i].quantity) > (+snack.amount)) {
                unavailableProducts.push(snack.product.name);
            }
        }
    }
    if (unavailableProducts.length !== 0) {
        sessionFlash.flashDataToSession(
            req,
            {
                title: 'SOME PRODUCTS ARE NOT CURRENTLY AVAILABLE',
                errorMessage: 'The following products are currently not available:',
                unavailableProducts: unavailableProducts,
                instruction: 'Please remove them to continue with the purchase.',
            },
            function () {
                res.redirect('/cart');
            }
        );
        return;
    }


    let employee;
    try {
        employee = await Employee.findById(res.locals.userid);
    } catch (error) {
        next(error);
        return;
    }

    // creating the order
    const order = new Order(cart, employee);

    let product;
    try {
        // updating database with purchased products 
        for (let i = 0; i < cart.items.length; i++) {
            if (cart.items[i].product.type === 'Ticket') {
                ticketData = {
                    product: {
                        name: cart.items[i].product.name,
                        type: cart.items[i].product.type,
                        price: cart.items[i].product.price,
                        imageName: cart.items[i].product.imageName,
                        points: cart.items[i].product.points,
                    },
                    rowChair: cart.items[i].product.rowChair,
                    columnChair: cart.items[i].product.columnChair,
                    isPreferencial: cart.items[i].product.isPreferencial,
                    show: cart.items[i].product.show,
                    status: 'unavailable',
                }
                product = new Ticket(ticketData);
                await product.save();
            } else {
                product = await Snack.findById(cart.items[i].product.snackId, true);
                product.amount--;
                await product.save();
            }
        }
        await order.save();
    } catch (error) {
        next(error);
        return;
    }
    // we delete the cart 'cause we added it to the order
    req.session.cart = null;

    res.redirect('/client/orders');
}

module.exports = {
    getProfile: getProfile,
    uploadPersonalInfo: uploadPersonalInfo,
    updatePassword: updatePassword,
    getEmployeeOrderPayment: getEmployeeOrderPayment,
}