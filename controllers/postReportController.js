const Post = require('../models/Post');
const Recipe = require("../models/Recipe.js")
const { success, failure } = require("../utils/message.js")
const PostReport = require('../models/PostReport.js');
const createNotification = require('../utils/createNotification');

module.exports.report_post = async function (req, res) {
    const user = req.user._id
    const post = req.params.id
    const postObj = await Post.findById(post)
    const reason = req.body.reason
    await PostReport.findOneAndUpdate(
        { user, post },
        { user, post, reason },
        { upsert: true }
    )
    const reportCount = await PostReport.count({ post })
    if (reportCount > 10) {
        await Post.deleteOne({ _id: post })
    }
    createNotification(postObj.user, user, "reported on your post.", "post", post )
    res.json(success(reportCount + " reports"))
}