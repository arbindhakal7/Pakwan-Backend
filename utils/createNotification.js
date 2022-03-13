const Notification = require('../models/Notification.js')

module.exports = function (userId, otherUser, message, relatedModel="user", relatedId="") {
    const notifyObject = {
        user: userId,
        related: relatedModel,
        message: message,
        otherUser: otherUser
    }
    if (relatedModel == "recipe") {
        notifyObject["relatedRecipe"] = relatedId
    }  
    if (relatedModel == "post"){
        notifyObject["relatedPost"] = relatedId
    }
    const notification = new Notification(notifyObject)
    notification.save()
}