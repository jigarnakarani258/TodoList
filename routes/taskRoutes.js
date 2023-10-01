const express = require('express');
const {  
   createTask,
   getTaskByID,
   updateTaskByID,
   deleteTaskByID,
   getAllTaskList
   } = require('../controllers/taskController')
const passport = require('passport');
const taskRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Task Management
 *     description: Task management related APIs 
 */

/**
 * @swagger
 * /createTask:
 *   post:
 *     tags:
 *       - Task Management
 *     summary: Create a new task
 *     description: Create a new task with the provided details.
 *     security:
 *       - jwt: []  #Requires JWT token authentication
 *     parameters:
 *      - in: body
 *        name: createTask 
 *        schema:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *              description: The title of the task.
 *            description:
 *              type: string
 *              description: The description of the task.
 *            dueDate:
 *              type: string
 *              format: date
 *              description: The due date of the task.
 *            priority:
 *              type: string
 *              description: The priority of the task.
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - JWT token not provided or invalid.
 *       500:
 *         description: Internal Server Error
 */
taskRouter.route('/createTask/').post( passport.authenticate("jwt", { session: false }), createTask );


/**
 * @swagger
 * /getTaskByID/{task_id}:
 *   get:
 *     tags:
 *       - Task Management
 *     summary: Get a task by ID
 *     description: Retrieve a task by its unique ID.
 *     security:
 *       - jwt: []  # Requires JWT token authentication
 *     parameters:
 *       - name: task_id
 *         in: path
 *         description: The ID of the task to retrieve.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - JWT token not provided or invalid.
 *       500:
 *         description: Internal Server Error
 */
taskRouter.route('/getTaskByID/:task_id').get( passport.authenticate("jwt", { session: false }), getTaskByID ) ;

/**
 * @swagger
 * /updateTaskByID/{task_id}:
 *   put:
 *     tags:
 *       - Task Management
 *     summary: Update a task by ID
 *     description: Update the details of a task by its unique ID.
 *     security:
 *       - jwt: []  # Requires JWT token authentication
 *     parameters:
 *       - name: task_id
 *         in: path
 *         description: The ID of the task to update.
 *         required: true
 *         type: string
 *       - in: body
 *         name: updateTask
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: The updated title of the task.
 *             description:
 *               type: string
 *               description: The updated description of the task.
 *             dueDate:
 *               type: string
 *               format: date
 *               description: The updated due date of the task.
 *             priority:
 *               type: string
 *               description: The updated priority of the task.
 *             completed:
 *               type: boolean
 *               description: The updated completion status of the task - true or false.
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized - JWT token not provided or invalid.
 *       500:
 *         description: Internal Server Error
 */
taskRouter.route('/updateTaskByID/:task_id').put( passport.authenticate("jwt", { session: false }), updateTaskByID )


/**
 * @swagger
 * /deleteTaskByID/{task_id}:
 *   delete:
 *     tags:
 *       - Task Management
 *     summary: Delete a task by ID
 *     description: Delete a task by its unique ID.
 *     security:
 *       - jwt: []  # Requires JWT token authentication
 *     parameters:
 *       - name: task_id
 *         in: path
 *         description: The ID of the task to delete.
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized - JWT token not provided or invalid.
 *       500:
 *         description: Internal Server Error
 */
taskRouter.route('/deleteTaskByID/:task_id').delete( passport.authenticate("jwt", { session: false }), deleteTaskByID )


/**
 * @swagger
 * /getAllTaskList:
 *   get:
 *     tags:
 *       - Task Management
 *     summary: Get a list of all tasks of loggedInUser.
 *     description: Retrieve a list of all tasks of loggedInUser based on query parameters.
 *     security:
 *       - jwt: []  # Requires JWT token authentication
 *     parameters:
 *       - name: title
 *         in: query
 *         description: Filter by task title (optional)
 *         required: false
 *         type: string
 *       - name: description
 *         in: query
 *         description: Filter by task description (optional)
 *         required: false
 *         type: string
 *       - name: dueDate
 *         in: query
 *         description: Filter by task dueDate (optional) //sample 2024-09-30
 *         required: false
 *         type: string
 *         format: date
 *       - name: priority
 *         in: query
 *         description: Filter by task priority (optional)
 *         required: false
 *         type: string
 *       - name: completed
 *         in: query
 *         description: Filter by task completion status (optional)
 *         required: false
 *         type: boolean
 *       - name: page
 *         in: query
 *         description: Page number for pagination (optional)
 *         required: false
 *         type: integer
 *       - name: limit
 *         in: query
 *         description: Number of results per page (optional)
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - JWT token not provided or invalid.
 */
taskRouter.route('/getAllTaskList').get( passport.authenticate("jwt", { session: false }),  getAllTaskList )

module.exports.taskRouter = taskRouter
