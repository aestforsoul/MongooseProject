const Article = require('../models/article');
const User = require('../models/user');
const errorHelper = require('../config/errorHelper');
const mongoose = require('mongoose');
const _ = require('lodash');

module.exports = {createArticle, updateArticle, searchArticle, deleteArticle};

async function createArticle(req, res, next) {
  try {
    const fields = ['title', 'subtitle', 'description', 'owner', 'category'];

    const data = _.pick(req.body, fields);

    if (!data.owner || !mongoose.isValidObjectId(data.owner)) {
      return next(errorHelper.badRequest('Article owner not ObjectId'));
    }

    const existOwner = await User.findById(data.owner);
    if (!existOwner) {
      return next(errorHelper.badRequest('Article owner not exists'));
    }

    const article = await Article.create(req.body);
    await User.findOneAndUpdate({_id: data.owner}, {$inc: {numberOfArticles: 1}}, {new: true});
    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
}

async function updateArticle(req, res, next) {
  const articleId = req.params.articleId;
  const body = req.body;
  try {
    const existingArticle = await Article.findOne({_id: articleId});
    if (!existingArticle) {
      return next(errorHelper.badRequest('Article not exists'));
    }

    if (body.title) {
      existingArticle.title = body.title;
    }

    if (body.subtitle) {
      existingArticle.subtitle = body.subtitle;
    }
    if (body.description) {
      existingArticle.description = body.description;
    }
    if (body.category) {
      existingArticle.category = body.category;
    }

    if (!body.title && !body.subtitle && !body.description && !body.category) {
      return next(errorHelper.badRequest('You can change existing fields'));
    }

    await Article.findOneAndUpdate({_id: articleId}, {$set: existingArticle}, {new: true});
    return res.status(200).json(existingArticle);
  } catch (err) {
    next(err);
  }
}

async function searchArticle(req, res, next) {
  try {
    const {
      query: {search = ''}
    } = req;
    const filter = new RegExp(util.escapeRegExpChars(search), 'i');
    const query = {
      $or: [{title: filter}, {subtitle: filter}, {description: filter}, {category: filter}]
    };
    const result = await Article.find(query).populate('owner');

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function deleteArticle(req, res, next) {
  const articleId = req.params.articleId;
  try {
    const article = await Article.findOne({_id: articleId});
    await User.findOneAndUpdate({_id: article.owner}, {$inc: {numberOfArticles: -1}}, {new: true});
    const result = await Article.deleteOne({_id: articleId});
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
