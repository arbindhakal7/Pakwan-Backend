const Recipe = require("../models/Recipe.js")
const Review = require("../models/Review.js")
const AvgRating = require("../utils/calculateAvgRating.js")
const createNotification = require("../utils/createNotification.js")
const { success, failure } = require("../utils/message.js")

exports.get_review_by_recipe_id = async function (req, res) {
    try {
        // Populate User
        const recipeReviews = await Review.find({ recipe: req.params.recipeId }).populate({
            path: 'user',
            select: 'firstname _id profile'
        }).select("-recipe")
        res.json(success("Reviews Successful", recipeReviews))
    }
    catch (e) {
        console.log(e)
        res.json(failure())
    }
    res.end()
}

exports.insert_new_review = async function (req, res) {
    try {
        const _id = req.user._id
        const recipeId = req.params.recipeId
        const review = new Review({
            user: _id,
            recipe: recipeId,
            review: req.body.review,
            rating: req.body.rating
        })
        await review.save()
        AvgRating(req.params.recipeId)
        res.json(success("New Review Added"))
        const recipe = await Recipe.findById(recipeId)
        createNotification(recipe.user, review.user, "reviewed on your recipe.", "recipe", recipeId )
    }
    catch (e) {
        console.log(e)
        res.json(failure())
    }
    res.end()
}

exports.update_review = async function (req, res) {
    try {
        await Review.updateOne({ _id: req.body._id, user: req.user._id }, {
            review: req.body.review,
            rating: req.body.rating
        })
        AvgRating(req.params.recipeId)
        res.json(success("Review Updated"))
    }
    catch (e) {
        console.log(e)
        res.json(failure())
    }
    res.end()
}

exports.delete_review = async function (req, res) {
    try {
        await Review.deleteOne({ _id: req.params.reviewId, user: req.user._id })
        AvgRating(req.params.recipeId)
        res.json(success("Review Deleted"))
    }
    catch (e) {
        console.log(e)
        res.json(failure())
    }
    res.end()
}