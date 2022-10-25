const connectToMongo = require('./db');
const express = require('express');

connectToMongo();

const app = express();
const port = 5000;

app.use(express.json());

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


//Start listening
app.listen(port, ()=>{
    console.log(`Server has started successfully at http://localhost:${port}`)
})