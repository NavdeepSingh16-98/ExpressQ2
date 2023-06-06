const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
        maxLength:[25,"Name must be 25 ch long"]
    },
    body: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)