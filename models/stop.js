// ./models/stop.js

const mongoose = require('mongoose');

// Define the schema for the stop
const stopSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true,
    },
    org: {
        type: String,
        required: true,
    },
    lat: {
        type: String,
        required: true,
    },
    long: {
        type: String,
        required:true,
    },
    radius: {
        type: String,
    },
    


});

// Create and export the stopModel
const stopModel = mongoose.model('stop', stopSchema);

module.exports = stopModel;
