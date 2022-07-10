const User = require('../models/user');
const Article = require('../models/article');
const errorHelper = require('../config/errorHelper');

module.exports = {createUser, updateUser, getUserById, deleteUser, getArticles};

async function createUser(req, res, next) {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  const userId = req.params.userId;
  const body = req.body;
  try {
    const existingUser = await User.findOne({_id: userId});
    if (!existingUser) {
      return next(errorHelper.badRequest('User not exists'));
    }
    if (body.firstName) {
      existingUser.firstName = body.firstName;
    }

    if (body.lastName) {
      existingUser.lastName = body.lastName;
    }

    if (!body.firstName && !body.lastName) {
      return next(errorHelper.badRequest('You can change first name and last name'));
    }

    await User.findOneAndUpdate({_id: userId}, {$set: existingUser}, {new: true});
    return res.status(200).json(existingUser);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({_id: userId});
    if (!user) {
      return next(errorHelper.badRequest('User not exists'));
    } else {
      return res.status(200).json(user);
    }
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({_id: userId});
    if (!user) {
      return next(errorHelper.badRequest('User not exists'));
    }
    await Article.deleteMany({owner: userId});
    const result = await User.deleteOne({_id: userId});

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getArticles(req, res, next) {
  const userId = req.params.userId;
  try {
    const articles = await Article.find({owner: userId});
    return res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
}
