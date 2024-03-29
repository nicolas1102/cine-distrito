const Client = require('../models/client.model');
const Order = require('../models/order.model');
const Show = require('../models/show.model');
const Ticket = require('../models/ticket.model');
const Snack = require('../models/snack.model');

const fs = require('fs');

const stripe = require('stripe')('sk_test_51MucuFDIw78rFBI19fpEpTu65AiHkbgFvrJjwynB58cVdUcwWwTni0UCB7S93c1QBNUiUB3exLwn7PLOkFyoXlk400K663xgm3');

// to create tell the session the user is logged in
const authUtil = require('../util/authentication');

const validation = require('../util/validation');

// to save user entered input data
const sessionFlash = require('../util/session-flash');

let patchCartTotalPrice;



async function getProfile(req, res, next) {

    // we get the session data saved
    let sessionData = sessionFlash.getSessionData(req);

    let clnt;
    try {
        clnt = await Client.findById(req.session.userid);

        // if there's no session data saved we define the default data
        if (!sessionData) {
            // default data
            sessionData = {
                email: clnt.email,
                name: clnt.name,
                identification: clnt.identification,
            }
        }

        res.render('client/profile', { clnt: clnt, inputData: sessionData });
    } catch (error) {
        next(error);
        return;
    }
}

async function uploadPersonalInfo(req, res, next) {
    const enteredData = {
        email: req.body.email,
        name: req.body.name,
        identification: req.body.identification,
    };

    if (
        !validation.clientPersonalInfoAreValid(
            req.body.email,
            req.body.name,
            req.body.identification
        )
    ) {
        // saving the data that the user has write, so if the request fail, the user wont lose the data the has wrote. we also, sent the message if there's any error in user input, so we can show the message in the webpage
        sessionFlash.flashDataToSession(
            req,
            {
                title: 'INVALID CREDENTIALS',
                errorMessage: 'Please check your input. No field can be left blank. Identification Card must be 10 characters.',
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

    let clnt;
    try {
        clnt = await Client.findById(req.session.userid);
    } catch (error) {
        next(error);
        return;
    }

    // we verify if there a new image to update
    //  just if the admin provides a new image for the movie we change it
    if (req.file) {
        // we delete the old movie image of the storage
        fs.unlink(clnt.imagePath, (error) => {
            if (error) {
                console.log("The old client image could not be deleted.");
                console.log(error);
            } else {
                console.log("Delete File successfully.");
            }
        });

        // replace the old image with the new one
        clnt.replaceImage(req.file.filename);
    }

    // we get the user profile personal info updated and we update our client with the new data
    clnt.updatePersonalInfo(req.body.email, req.body.name, req.body.identification);

    //  we save the updated client in the database
    try {
        await clnt.save();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    res.redirect('/client/profile');
}

async function updatePassword(req, res, next) {
    const enteredData = {
        email: req.body.email,
        name: req.body.name,
        identification: req.body.identification,
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

    let clnt;
    try {
        clnt = await Client.findById(req.session.userid);
    } catch (error) {
        next(error);
        return;
    }

    await clnt.updatePassword(req.body['confirm-password']);

    //  we save the updated client in the database
    try {
        await clnt.save();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    // we delete the user session
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}

async function deleteClient(req, res, next) {
    const enteredData = {
        email: req.body.email,
        name: req.body.name,
        identification: req.body.identification,
    };

    if (!validation.validateAccountDeletingConfirmation(req.body['delete-confirmation'])) {
        sessionFlash.flashDataToSession(
            req,
            {
                title: 'THE ACCOUNT DELETING CONFIRMATION IS INCORRECT',
                errorMessage: 'Please check your input.',
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

    let clnt;
    try {
        clnt = await Client.findById(req.session.userid);

        // we delete the old product image of the storage
        fs.unlink(clnt.imagePath, (error) => {
            if (error) {
                console.log("The old client image could not be deleted.");
                console.log(error);
            } else {
                console.log("Delete File successfully.");
            }
        });

        await clnt.remove();
    } catch (error) {
        next(error);
        return;
    }

    // we delete the user session
    authUtil.destroyUserAuthSession(req);
    res.redirect('/home');
}



async function getOrders(req, res, next) {
    try {
        const orders = await Order.findAllForUser(res.locals.userid);
        // searching the show for each order ticket
        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].cart.items.length; j++) {
                if (orders[i].cart.items[j].product.showId) {
                    let show = await Show.findById(orders[i].cart.items[j].product.showId);
                    orders[i].cart.items[j].product.show = show;
                }
            }
        }

        res.render('client/orders/all-orders', {
            orders: orders,
        });
    } catch (error) {
        next(error);
    }
}

async function getPayment(req, res, next) {
    const cart = res.locals.cart;

    let client;
    try {
        client = await Client.findById(res.locals.userid);
    } catch (error) {
        next(error);
        return;
    }

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

    // ticket discount for number of user points
    let discountApplied = false;
    for (let i = 0; i < cart.items.length; i++) {
        if (
            (client.points >= 100) &&
            (cart.items[i].product.type === 'Ticket') &&
            ((cart.totalPrice - cart.items[i].product.price) !== 0)
        ) {
            const discount = cart.items[i].product.price;
            cart.items[i].product.price = 0;
            cart.items[i].totalPrice = cart.items[i].totalPrice - discount;
            cart.totalPrice = cart.totalPrice - discount;
            client.points = client.points - 100;
            discountApplied = true;
            console.log('discount for number of user points');
        } else {
            console.log('no discount');
        }
    }
    if (discountApplied) {
        // update client points
        client.save();
        res.locals.cart = cart;
        patchCartTotalPrice = cart.totalPrice;
    }

    // processing the payment
    let session;
    try {
        session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cart.items.map(function (item) {
                if (item.product.type === 'Ticket') {
                    return {
                        price_data: {
                            // COP is not supported
                            currency: 'usd',
                            product_data: {
                                name: item.product.name + ' - ' + item.product.show.movie.title + ' - ' + new Date(item.product.show.date).toDateString() + ', ' + item.product.show.time + ' - ' + String.fromCharCode(97 + (+item.product.rowChair)).toUpperCase() + item.product.columnChair,
                            },
                            unit_amount: +item.product.price * 100,
                        },
                        quantity: item.quantity,
                    };
                } else {
                    return {
                        price_data: {
                            // cop is not supported
                            currency: 'usd',
                            product_data: {
                                name: item.product.name,
                            },
                            unit_amount: +item.product.price * 100,
                        },
                        quantity: item.quantity,
                    };
                }
            }),
            mode: 'payment',
            success_url: `http://localhost:3000/client/orders/success`,
            cancel_url: `http://localhost:3000/client/orders/cancel`,
        });
    } catch (error) {
        next(error);
        res.redirect('/client/orders/cancel');
        return;
    }
    res.redirect(303, session.url);
}

async function getSuccessOrder(req, res, next) {
    const cart = res.locals.cart;
    cart.totalPrice = patchCartTotalPrice;

    let client;
    try {
        client = await Client.findById(res.locals.userid);
    } catch (error) {
        next(error);
        return;
    }

    // creating the order
    const order = new Order(cart, client);

    try {
        let product;
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

        // updating user points
        client.points = client.points + cart.totalPoints;
        await client.save();
    } catch (error) {
        next(error);
        return;
    }
    // we delete the cart 'cause we added it to the order
    req.session.cart = null;

    res.render('client/orders/success');
}

function getFailureOrder(req, res) {
    res.render('client/orders/failure');
}

module.exports = {
    getProfile: getProfile,
    uploadPersonalInfo: uploadPersonalInfo,
    updatePassword: updatePassword,
    deleteClient: deleteClient,
    getOrders: getOrders,
    getPayment: getPayment,
    getSuccessOrder: getSuccessOrder,
    getFailureOrder: getFailureOrder
}