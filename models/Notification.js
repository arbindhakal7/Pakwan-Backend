const mongoose = require("mongoose")
const moment = require('moment')
const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
    },
    related: {
        type: String,
        enum: ["recipe", "post", "user"]
    },
    relatedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },
    relatedRecipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        default: null
    },
    otherUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: dateConverter
    }
}, { toJSON: { getters: true } })
function dateConverter(date) {
    return moment(date).fromNow()
}
module.exports = mongoose.model("Notification", notificationSchema)