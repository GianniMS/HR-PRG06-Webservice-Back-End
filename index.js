const express = require("express");
const bodyParser = require('body-parser')

// Load environment variables
require('dotenv').config()

// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/books";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Create webserver
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Use bodyparser middleware to parse x-form-www-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// Use bodyparser middleware to parse json data
app.use(bodyParser.json({type: 'application/json'}))

// Create endpoint + connect books router
app.use("/books/", require('./router/booksRouter'))

// Start webserver on port 8000
app.listen(8000, () => {
    console.log("Express started");
})
