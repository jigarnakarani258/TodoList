const { Tasks } = require("../Models/taskModel");
const { messages } = require('../utility/messages');
const { AppError } = require('../utility/appError');

//create Task API, Authenticated with Passport JS
const createTask = async (req, res, next) => {

  try {
    const { title, description, dueDate, priority } = req.body;

    //user id get from token
    let createdByUser = req.user._id

    if (title == "string" || description == "string" || priority == "string" || dueDate == "string") {
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
      priority,
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

    let getTask = await Tasks.findById(task_id, { __v: 0 })

    if (!getTask) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.task_not_found_with_provided_id
      });
    }
    else if (getTask.createdByUser.toString() != user_id) {
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

//updateTaskByID API , Authenticated with Passport JS
const updateTaskByID = async (req, res, next) => {

  try {
    const user_id = (req.user._id).toString();
    let task_id = req.params.task_id

    let accesscheck = await Tasks.findById(task_id)
    if (!accesscheck) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.task_not_found_with_provided_id
      });
    }
    else if (accesscheck.createdByUser.toString() != user_id) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.user_can_not_access_other_user_tasks
      });
    }
    const { title, description, dueDate, priority, completed } = req.body;

    if (title == "string" || description == "string" || priority == "string" || dueDate == "string") {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_of_task
      });
    }

    if (completed) {
      if (completed != true && completed != false) {
        return res.status(400).json({
          status: "Bad Request",
          requestAt: req.requestTime,
          errorCode: 400,
          message: messages.enter_valid_value_of_task_completed_flag
        });
      }
    }

    let updateTaskData = {
      title,
      description,
      dueDate,
      priority,
      completed
    }

    let updatedTask = await Tasks.findByIdAndUpdate(task_id, updateTaskData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.task_not_found_with_provided_id
      });
    }
    else {
      return res.status(200).json({
        status: "Success",
        requestAt: req.requestTime,
        updatedTask: updatedTask,
        message: messages.task_updated_successfully,
      });
    }
  }
  catch (err) {
    return next(new AppError(err, 400));
  }

};

//deleteTaskByID API , Authenticated with Passport JS
const deleteTaskByID = async (req, res, next) => {

  try {
    //user id get from token
    const user_id = (req.user._id).toString();
    let task_id = req.params.task_id

    let accesscheck = await Tasks.findById(task_id)
    if (!accesscheck) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.task_not_found_with_provided_id
      });
    }
    else if (accesscheck.createdByUser.toString() != user_id) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.user_can_not_access_other_user_tasks
      });
    }

    let deleteTask = await Tasks.findByIdAndDelete(task_id)

    if (!deleteTask) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.task_not_found_with_provided_id
      });
    }
    else {
      return res.status(200).send({
        status: "success",
        requestAt: req.requestTime,
        Task_id: deleteTask._id,
        Task_Title: deleteTask.title,
        message: messages.task_deleted_successfully,
      });
    }
  } catch (err) {
    return next(new AppError(err, 400));
  }

};

//getAllTaskList API , Authenticated with Passport JS
const getAllTaskList = async (req, res, next) => {

  try {

    //user id get from token
    const user_id = req.user._id

    const { title, description, dueDate, priority, completed } = req.query;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    if (page <= 0 || limit <= 0) {
      return res.status(401).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_for_pagination
      });
    }

    // create the filter criteria based on query request parameters
    const filter = {};
    if (title) {
      filter.title = { $regex: new RegExp(title, 'i') };
    }
    if (description) {
      filter.description = { $regex: new RegExp(description, 'i') };
    }
    if (dueDate) {
      filter.dueDate = dueDate;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (completed) {
      filter.completed = completed;
    }

    const skip = (page - 1) * limit;

    filter.createdByUser = user_id

    // Query into mongoDB with filtering and pagination
    const taskList = await Tasks.find(filter, { __v: 0 })
      .skip(skip)
      .limit(limit);

    const totalResults = await Tasks.countDocuments(filter);

    return res.status(200).send({
      status: "success",
      requestAt: req.requestTime,
      NoResults: taskList.length,
      totalResults,
      data: {
        tasks: taskList,
      },
    });
  } catch (err) {
    return next(new AppError(err, 400));
  }
};

module.exports = {
  createTask,
  getTaskByID,
  updateTaskByID,
  deleteTaskByID,
  getAllTaskList
};





