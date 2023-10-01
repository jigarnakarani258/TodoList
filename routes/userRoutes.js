const express = require('express');
const { SignUp, LogIn, getCurrentUser
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

/**
 * @swagger
 * /LogIn:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Log-In user with email and password.
 *     description: Log in user with email and password on Todo-List using this api.
 *     parameters:
 *      - in: body
 *        name: Log-In
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       200:
 *         description: Sign in successful
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
userRouter.route('/LogIn').post(LogIn);


/**
 * @swagger
 * /GetCurrentProfile:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Get the current user's profile
 *     description: Get the profile information of the currently authenticated user.
 *     security:
 *       - jwt: []  # Requires JWT token authentication
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - JWT token not provided or invalid.
 */

userRouter.route("/GetCurrentProfile").get(passport.authenticate("jwt", { session: false }), getCurrentUser);



module.exports.userRouter = userRouter