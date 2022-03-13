const mongoose = require("mongoose")
require('dotenv').config()

const URI = process.env.DB_URI || 'mongodb://localhost:27017/pakwan'
module.exports = () => {
    console.log("Connecting to database")
    return mongoose.connect(URI)
}