// const mongoose = require('mongoose');
import mongoose from 'mongoose'
//connecting to mongoDB
mongoose.connect(process.env.MONGOOSE_URL as string);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


export default db;