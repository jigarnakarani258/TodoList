const { Tasks } = require("../Models/taskModel");
const { AppError } = require('../utility/appError');
const cron = require('node-cron')

//markExpiredTodoItemsAsCompleted API 
const markExpiredTodoItemsAsCompleted = async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        try {

            const currentDate = new Date();
            // Find tasks with an expired due date and not completed
            const expiredTasks = await Tasks.find({
                dueDate: { $lt: currentDate },
                completed: false,
            });

            //Update each expired task to mark it as completed
            const updatePromises = expiredTasks.map(async (task) => {
                task.completed = true;
                return task.save();
            });
            let updateStatusOfTasks = await Promise.all(updatePromises);

            if (updateStatusOfTasks.length > 0)
                console.log('Marked expired todo items as completed.');
            resolve(updateStatusOfTasks);

        }
        catch (err) {
            return reject(err)
        }
    })

};

//cronJob API 
const cronJob = async (req, res, next) => {

    try {
        let task = cron.schedule(`0 0 1 * * *`, () => {
            console.log("Runnning task at every day at 1 AM , 0 minute and 0 sec");

            markExpiredTodoItemsAsCompleted()
                .then((res1) => {
                    //success
                })
                .catch((err) => {
                    return next(new AppError(err, 400));
                });
        })

        task.start()

    }
    catch (err) {
        return next(new AppError(err, 400));
    }

};

module.exports = {
    markExpiredTodoItemsAsCompleted,
    cronJob
};

