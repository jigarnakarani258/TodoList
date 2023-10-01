const express = require('express');
const { SignUp
} = require('../controllers/userController')
const passport = require('passport');
const userRouter = express.Router();


/**
 * @swagger
 * tags:
 *   - name: User Management
 *     description: User management related APIs 
 */

/**
 * @swagger
 * /SignUp:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Sign-Up with this api.
 *     description: Register user on Todo-List using this api.
 *     parameters:
 *      - in: body
 *        name: Sign-Up 
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       201:
 *         description: Created
 */
userRouter.route('/SignUp').post(SignUp)


module.exports.userRouter = userRouter