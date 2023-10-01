const express = require('express')
const app = express();

const { globalErrController } = require('./controllers/errorController')
const { AppError } = require('./utility/appError')
const { userRouter } = require(`${__dirname}/routes/userRoutes.js`)
const { taskRouter } = require(`${__dirname}/routes/taskRoutes`);
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const cors = require('cors');
const bodyParser = require('body-parser')
const passport = require('passport');
const { cronJob } = require('./controllers/cronJobController');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

app.use('/api/v1', userRouter)
app.use('/api/v1', taskRouter)

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Todo-List',
            description: `Todo-List app - which is provide to manage daily routines  task's.
                         In this app we manage user , task management.`
        },
        tags: [
            {
                name: 'User Management',
                description: 'User management related APIs .',
            },
            {
                name: 'Task Management',
                description: 'Task management related APIs .',
            }
        ],
        securityDefinitions: {
            jwt: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
        basePath: '/api/v1',
    },
    apis: [
        "./routes/userRoutes.js",
        "./routes/taskRoutes.js"
    ]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Schedule Cron-Job
cronJob();

//passport authentication 
app.use(passport.initialize());
require(`${__dirname}/utility/passport.js`)


//here app.all use for all method(get,post,put,delete)
//Unhandled Routes Handling 
app.all('*', (req, res, next) => {
    let err = {
        name: 'customPathError',
        message: `Can not find route ${req.originalUrl} on this server, Please check API route.`
    }
    return next(new AppError(err, 404));
})

//Global error Middleware // Ex->{ next(err)} 
app.use(globalErrController)

module.exports = app;
