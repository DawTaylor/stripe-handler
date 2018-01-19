var stripe = require('stripe')('sk_test_xNrbGHbVNiODMiyfSsB9Rfaa')

module.exports = function (context, req) {
    context.log('Starting request');

    if(
        req.body &&
        req.body.stripeEmail &&
        req.body.stripeToken &&
        req.body.stripeAmt
    ) {
        context.log('Creating stripe customer')
        stripe.customers
            .create({
                email: req.body.stripeEmail,
                source: req.body.stripeToken
            })
            .then(customer => {
                context.log('Starting stripe charging flow.')
                stripe.charges.create({
                    amount: req.body.stripeAmt,
                    description: 'Test charge',
                    currency: 'USD',
                    customer: customer.id
                });
            })
            .then(charge => {
                context.log('Charge created')
                context.res({
                    body: 'Succesfully charged'
                })
                context.done
            })
            .catch(err =>{
                context.log(err)
                context.res({
                    status: 400,
                    body: 'Something went wrong' + JSON.stringify(err)
                })
                context.done()
            })
    }
    else {
        context.log(req.body)
        context.res({
            status: 400,
            body: "We're missing something"
        })
        context.done()
    }
}