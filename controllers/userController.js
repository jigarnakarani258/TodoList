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

module.exports = {
  SignUp
 
}