// ./models/org.js

const mongoose = require('mongoose');

// Define the schema for the org
const orgSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
    },
    name:{
        type:String,
        required: true,
    },
    contact:{
        type:String,
        required: true,
    },
    
    
});

// Create and export the orgModel
const orgModel = mongoose.model('org', orgSchema);

module.exports = orgModel;
