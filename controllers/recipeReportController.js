const Post = require('../models/Post');
const Recipe = require("../models/Recipe.js")
const { success, failure } = require("../utils/message.js")
const RecipeReport = require('../models/RecipeReport.js');
const createNotification = require('../utils/createNotification');

module.exports.report_recipe = async function (req, res) {
    const user = req.user._id
    const recipe = req.params.id
    const recipeObj = await Recipe.findById(recipe)
    const reason = req.body.reason
    await RecipeReport.findOneAndUpdate(
        { user, recipe},
        { user, recipe, reason },  
        { upsert: true }
    )
    const reportCount = await RecipeReport.count({ recipe })
    if (reportCount > 10) {
        Recipe.deleteOne({ _id: recipe })
        Post.deleteMany({ relatedRecipe: recipe })
    }
    createNotification(recipeObj.user, user, "reported on your recipe.", "recipe", recipe )
    res.json(success(reportCount + " reports"))
}