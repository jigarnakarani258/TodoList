const { Users } = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { messages } = require('../utility/messages');
const { AppError } = require('../utility/appError');

const signToken = (id, email) => {
  return jwt.sign(
    { id: id, email: email},
    process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
}

//SignUp API
const SignUp = async (req, res, next) => {

  try {
    const { name, email, password  } = req.body;

     if(  name == "string" || email == "string" || password == "string" ){
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_of_user
      });
    }

    let user = new Users({
      name,
      email,
      password
    });

    user
      .save()
      .then(() => {
        return res.status(201).json({
          status: "success",
          requestAt: req.requestTime,
          data: {
            newUser: {
              id: user._id,
              email: user.email,
              name: user.name
            },
          },
          message: messages.user_registered_successfully
        });
      })
      .catch(err => {
        return next(new AppError(err, 400));
      });

  } catch (err) {
    return next(new AppError(err, 400));
  }
};

//LogIn API
const LogIn = async (req, res, next) => {

  try {
    const { email, password } = req.body;

     if(  email == "string" || password == "string" ){
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_of_user
      });
    }

    //1) Check email and password exists.
    if (!email) {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.provide_email,
      });
    }

    if (!password) {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.provide_password,
      });
    }

    //2) Check if user exist
    const ValidUser = await Users.findOne({ email: email });
    if (ValidUser) {
      var LogInUser = await Users.findOne({ email: email }).select('+password');
    }
    else {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.invalid_email
      });
    }

    //3) password is correct
    const CorrectPassword = await ValidUser.ValidatePassword(
      password,
      LogInUser.password
    );
    if (CorrectPassword) {
      const token = signToken(LogInUser._id, LogInUser.email );
      res.status(200).json({
        status: 'Success',
        requestAt: req.requestTime,
        token: `Bearer ${token}`,
        message: messages.user_login_successfully
      });
    }
    else {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.invalid_password
      });
    }
  } catch (err) {
    return next(new AppError(err, 400));
  }


};

//GetCurrentUser API , Authenticated with Passport JS
const getCurrentUser = async (req, res, next) => {

  try {
    const id = req.user._id
    let currentUser = await Users.findById(id,{ __v: 0 })
    return res.status(200).send({
      status: "success",
      requestAt: req.requestTime,
      user: currentUser,
      message: messages.user_get_successfully,
    });
  } catch (err) {
    return next(new AppError(err, 400));
  }

};


module.exports = {
  SignUp,
  LogIn,
  getCurrentUser
}