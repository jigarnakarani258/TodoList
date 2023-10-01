const express = require('express');
const {  
   createTask
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

module.exports.taskRouter = taskRouter
