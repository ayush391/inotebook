const mongoose = require('mongoose');

const {Schema} = mongoose;

const NoteSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    tag:{
        type: String,
        required: true,
        default: 'general'
    },
    date:{
        type: Date,
        required: true,
        default: Date.now
    },
    
})


module.exports = mongoose.model('notes', NoteSchema);