const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook";


const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log('Connection to MongoDB was Successfull');
    })
}

module.exports = connectToMongo;
