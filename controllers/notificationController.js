const Notification = require("../models/Notification.js")
const { success } = require("../utils/message.js")

module.exports.get_user_notification = async function (req, res) {
    const user = req.user._id
    const notifications = await Notification.find({ user }).populate("otherUser")
    res.json(success("Fetched User Notification", notifications))
}