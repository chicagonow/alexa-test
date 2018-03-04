const index = require('./index');
const EventHelper = require('./handlers/events/EventsHandler');

let dumbAdditionTest = () => {
    let x = 1;
    let y = 2;

    let result = x + y;
    if (result !== 3) {
        throw "Simple addition doesn't work, 1 + 2 was: " + result;
    } else {
        console.log("dumb test passed");
    }
};
//
// let ctaTest = () => {
//     index.handlers.CtaIntent();
// };

let eventHelperTest = () => {
    EventHelper.searchEvents((result,error,response)=> {

        if (response.statusCode === 200) {
            console.log('eventHelperTest  passed!');
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
        } else {
            throw "Expected status code 200, but was " + response.statusCode

        }
    });
};


exports.all = () => {

    dumbAdditionTest();
    // ctaTest();
    eventHelperTest();

};

    require('make-runnable');