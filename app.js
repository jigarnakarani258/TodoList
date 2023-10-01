const express = require('express')
const app = express();

const {globalErrController} = require('./controllers/errorController')
const {AppError} =require('./utility/appError')


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



//here app.all use for all method(get,post,put,delete)
//Unhandled Routes Handling 
app.all('*',(req,res,next)=>{
    let err = {
        name : 'customPathError',
        message : `Can not find route ${req.originalUrl} on this server, Please check API route.`
    }
    return next(new AppError(err, 404));
})

//Global error Middleware // Ex->{ next(err)} 
app.use(globalErrController)

module.exports = app;
