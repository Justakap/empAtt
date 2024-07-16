// ./models/route.js

const mongoose = require('mongoose');

// Define the schema for the route
const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    org: {
        type: String,
        required: true,
    },
    stop: [{
        id: String,
        name: String,
        sequence: Number,
        lat:Number,
        long:Number
    }],
    
});

// Create and export the routeModel
const routeModel = mongoose.model('route', routeSchema);

module.exports = routeModel;
