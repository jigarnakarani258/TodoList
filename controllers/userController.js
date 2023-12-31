const { Users } = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { messages } = require('../utility/messages');
const { AppError } = require('../utility/appError');

const signToken = (id, email) => {
  return jwt.sign(
    { id: id, email: email },
    process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
}

//SignUp API
const SignUp = async (req, res, next) => {

  try {
    const { name, email, password } = req.body;

    if (name == "string" || email == "string" || password == "string") {
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

    if (email == "string" || password == "string") {
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
      const token = signToken(LogInUser._id, LogInUser.email);
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
    let currentUser = await Users.findById(id, { __v: 0 })
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

//UpdateCurrentUserProfile API , Authenticated with Passport JS
const updateCurrentUserProfile = async (req, res, next) => {

  try {
    const id = req.user._id

    let { name, password } = req.body;
    if (name == "string" || password == "string") {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_of_user
      });
    }

    if (password) {
      password = await bcrypt.hash(password, 12);
    }
    let updatedata = {
      name,
      password
    }

    let updatedUser = await Users.findByIdAndUpdate(id, updatedata, {
      new: true,
      runValidators: true
    });
    if (!updatedUser) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.user_not_found_with_provided_id
      });
    }
    else {
      return res.status(200).json({
        status: "Success",
        requestAt: req.requestTime,
        message: messages.user_update_successfully,
        updatedUser: updatedUser,
      });
    }
  } catch (err) {
    return next(new AppError(err, 400));
  }

};

//getAllUserList API , Authenticated with Passport JS
const getAllUserList = async (req, res, next) => {
  try {
    const { name, email } = req.query;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_for_pagination
      });
    }

    // create the filter criteria based on query request parameters
    const filter = {};
    if (name) {
      filter.name = { $regex: new RegExp(name, 'i') };
    }
    if (email) {
      filter.email = { $regex: new RegExp(email, 'i') };
    }

    const skip = (page - 1) * limit;

    // Query into mongoDB with filtering and pagination
    const userList = await Users.find(filter, { __v: 0 })
      .skip(skip)
      .limit(limit);

    const totalResults = await Users.countDocuments(filter);

    return res.status(200).send({
      status: "success",
      requestAt: req.requestTime,
      NoResults: userList.length,
      totalResults,
      data: {
        users: userList,
      },
    });
  } catch (err) {
    return next(new AppError(err, 400));
  }
};

module.exports = {
  SignUp,
  LogIn,
  getCurrentUser,
  updateCurrentUserProfile,
  getAllUserList
}