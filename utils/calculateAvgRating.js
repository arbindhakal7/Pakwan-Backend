const Review = require('../models/Review.js')
const Recipe = require('../models/Recipe.js')

module.exports = async function (recipeId) {
    const recipeReviews = await Review.find({ recipe: recipeId })
    let totalRating = 0
    recipeReviews.forEach(recipeReview => {
        totalRating += recipeReview.rating
    });
    const recipe = await Recipe.findById(recipeId)
    recipe.avgRating = Math.ceil(totalRating / recipeReviews.length)
    recipe.save()
}