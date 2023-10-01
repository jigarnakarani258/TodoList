const express = require('express')
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser')


app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use( express.json() );
app.use( (req , res , next) =>{
    req.requestTime = new Date().toISOString();
    next();
})




module.exports = app;
