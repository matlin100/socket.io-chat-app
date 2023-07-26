const moment = require('moment');

const generateMessage = ( user,  text ) => {
    const timestamp = moment().format('h:mm a');
    return {
        user,
        text,
        timestamp
    }
}

module.exports = { 
    generateMessage
 }