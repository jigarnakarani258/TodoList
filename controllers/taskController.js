const { Tasks } = require("../Models/taskModel");
const { messages } = require('../utility/messages');
const { AppError } = require('../utility/appError');

//create Task API, Authenticated with Passport JS
const createTask = async (req, res, next) => {

  try {
    const { title, description, dueDate, priority } = req.body;

    //user id get from token
    let createdByUser = req.user._id

    if(  title == "string" || description == "string" || priority == "string"  || dueDate == "string"){
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_of_task
      });
    }

    let task = new Tasks({
      title,
      description,
      dueDate,
      priority ,
      createdByUser
    });

    const ValidTask = await Tasks.findOne({
      title,
      description,
      priority,
      createdByUser
    });

    if (ValidTask) {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.task_already_addded_by_user
      });
    }

    task
      .save()
      .then(() => {
        return res.status(201).json({
          status: "success",
          requestAt: req.requestTime,
          newTask: {
            id: task._id,
            title,
            description,
            dueDate,
            priority,
            createdByUser
          },
          message: messages.task_created_successfully
        });
      })
      .catch(err => {
        return next(new AppError(err, 401));
      });
  } catch (err) {
    return next(new AppError(err, 401));
  }

};

//getTaskByID API , Authenticated with Passport JS
const getTaskByID = async (req, res, next) => {

  try {
    //user id get from token
    const user_id = (req.user._id).toString();
    let task_id = req.params.task_id

    let getTask = await Tasks.findById(task_id , { __v:0 })

    if (!getTask) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.task_not_found_with_provided_id
      });
    }
    else if( getTask.createdByUser.toString() != user_id ){
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.user_can_not_access_other_user_tasks
      });
    }
    else {
      return res.status(200).send({
        status: "success",
        requestAt: req.requestTime,
        task: getTask,
        message: messages.task_get_successfully,
      });
    }
  } catch (err) {
    return next(new AppError(err, 400));
  }

};

module.exports = {
  createTask,
  getTaskByID
};





