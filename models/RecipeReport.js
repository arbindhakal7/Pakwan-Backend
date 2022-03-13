const mongoose = require('mongoose');

const recipeReportSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    },
    reportDate: {
        type: Date,
        default: Date.now,
        // enum: ["harassing", "spam", "nudity", "sexual", "graphic violence", "hate" ,"drug promotion", "abuse"]
    },
    reason: {
        type: String,
    }
})
module.exports = mongoose.model("RecipeReport", recipeReportSchema)