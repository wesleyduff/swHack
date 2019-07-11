const { Chromeless } = require('chromeless');
const moment = require('moment');
const fs = require('fs');

const timeOfFlight = process.env.FLIGHT_DEPARTURE_TIME;
const confirmationNumber = process.env.CONFIRMATION;
console.log(process.env.NAME);
const [firstName, lastName] = process.env.NAME.split(' ');
const moment_timeOfFlight = moment(new Date(timeOfFlight));
const allowedTimeToCheckin = moment(new Date(timeOfFlight)).subtract(1441, "minutes");
const moment_currentTime = moment();

console.log('flight time : ' + moment_timeOfFlight.format('MMMM Do YYYY, h:mm:ss a'));
console.log('allowed time to checkin : ' + allowedTimeToCheckin.format('MMMM Do YYYY, h:mm:ss a'));
console.log('current time : ' + moment_currentTime.format('MMMM Do YYYY, h:mm:ss a'));

if(allowedTimeToCheckin.isSameOrBefore(moment_currentTime)){

    const chromeless = new Chromeless({
        launchChrome: false
    })

    let counter = 0,
        stopTryingAfterCountNumber = 3;

    async function run(){
        if(counter > stopTryingAfterCountNumber){
            console.log('--- stopping due to incorrect timeframe');
            await chromeless.end();
            return false;
        }
        const test = await chromeless
            .goto(
                'https://www.southwest.com/air/check-in/'
            )
            .wait('5000')
            .type(confirmationNumber, 'input#confirmationNumber')
            .type(firstName, 'input#passengerFirstName')
            .type(lastName, 'input#passengerLastName')
            .click('#form-mixin--submit-button')
        if(await chromeless.exists('.page-error')){
            console.log('--- fail');
            counter++;
            run();
        } else {
            console.log('continue')
            await chromeless.end();
        }
    }

run().catch(console.error.bind(console))
} else {
    console.log('try again later')
}


