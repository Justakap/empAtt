const mongoose = require("mongoose")

const PunchInSchema = mongoose.Schema({
    empId: {
        type: String,
        required: true
    },
    empOrgId: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    long: {
        type: String,
        required: true
    },
    punchedInAt: {
        type: Date,
        required:true
    },
    punchedInAtDate: {
        type: String,
        required:true
    },
    punchedOutAt: {
        type: Date,
    },


})

const PunchInModel = mongoose.model('PunchIn', PunchInSchema)

module.exports = PunchInModel