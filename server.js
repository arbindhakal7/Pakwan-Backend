require('dotenv').config();

const app = require('./app.js')
const connection = require("./utils/dbConnection.js")

const port = process.env.PORT || 8080;
console.log(process.env.NODE_ENV)

connection().then(()=>{
    app.listen(port, ()=>{
        console.log(`Listening at http://localhost:${port}`);
    })
}).catch((err)=>{
    console.log(err);
})