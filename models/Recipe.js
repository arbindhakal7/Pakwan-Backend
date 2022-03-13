const mongoose = require('mongoose');

const preparationSchema = mongoose.Schema({
    preparation: {
        type: Number,
    },
    cooking: {
        type: Number,
    },
    serving: {
        type: Number,
    },
    yield: {
        type: Number,
    }
})

const ingredientSchema = mongoose.Schema({
    quantity: {
        type: Number
    },
    unit: {
        type: String,
        enum: ['tablespoon', 'teaspoon', 'cup', 'fluid ounce', 'pint', 'quart', 'pound']
    },
    item: {
        type: String,
    }
})

const recipeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
    },
    image: {
        type: String,
        default: "",
    },
    description: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    archive: {
        type: Boolean,
        default: false
    },
    isPosted: {
        type: Boolean,
        default: false
    },
    preparation: {
        type: preparationSchema,
        default: {preparation: 0, cooking: 0, serving: 0, yield: 0}
    },
    ingredients: [ingredientSchema],
    direction: [String],
    hashtag: [String],
    avgRating: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Recipe", recipeSchema);