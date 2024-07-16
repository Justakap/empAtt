const mongoose = require("mongoose")

const EmpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    empOrgId: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },

})

const EmpModel = mongoose.model('emp', EmpSchema)

module.exports = EmpModel