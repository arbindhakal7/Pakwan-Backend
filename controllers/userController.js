const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const moment = require('moment')
const User = require("../models/User.js");
const cloudinary = require("../utils/cloudinary.js")
const { success, failure } = require("../utils/message.js")
const Post = require('../models/Post')
const Recipe = require('../models/Recipe')
const Restaurant = require('../models/Restaurant.js');
const tokenKey = process.env.TOKEN_KEY
const sendEmail = require('../utils/send-email.js')
const passwordTemplate = require('../utils/generate-password-reset-template')
const randomIntGenerator = require('../utils/generate-random-int.js');
const getUnarchivedRecipe = require("../utils/getUnarchivedRecipe.js");
const createNotification = require('../utils/createNotification.js');

exports.register_new_user = async function (req, res) {
    try {
        const checkUser = await User.findOne({ email: req.body.email });
        // Check if user email exists
        if (checkUser) {
            res.json(failure("Email already exist"));
        }
        else {
            const fullname = req.body.fullname
            const password = req.body.newPassword
            const email = req.body.email
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            // Set Default User Profile
            const avatarUrl = `https://ui-avatars.com/api/?background=random&name=${fullname}`;
            const user = new User({
                fullname: fullname,
                email: email,
                profile: avatarUrl,
                password: hashed
            })
            await user.save();
            res.json(success("Registeration successful."));
        }
    }
    catch (error) {
        console.log(error);
        res.json(failure());
    }
    res.end()
}

exports.login_user = async function (req, res) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        const validLogin = await bcrypt.compare(req.body.password, user.password);
        if (validLogin) {
            const _id = user._id
            const accessToken = jwt.sign({ _id }, process.env.TOKEN_KEY);
            res.json({
                message: "Login Successful",
                data: user,
                accessToken: accessToken,
                success: true
            })
        } else {
            // Incorrect Password
            res.json(failure("Invalid Credential"));
        }
    } else {
        -
            // Incorrect Email
            res.json(failure("Invalid Credential"));
    }
    res.end();
}

exports.get_user_detail = async function (req, res) {
    try {
        let requestedUser = await User.findById(req.user._id).select("fullname profile bio email website address follower phone following recentlyViewed").populate("savedRecipe recentlyViewed")
        const data = requestedUser.toObject()
        data["savedRecipe"] = getUnarchivedRecipe(data.savedRecipe)
        data["post"] = await Post.find({ user: req.user._id , archive:false}).populate("user relatedRecipe")
        data["recipe"] = await Recipe.find({ user: req.user._id, isPosted: true, archive:false })
        data["restaurant"] = await Restaurant.findOne({ user: req.user._id})
        res.send(success("User Fetched", data));
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end();
}

exports.get_user_recipe = async function (req, res) {
    try {
        const data = await Recipe.find({ user: req.user._id, isPosted: true, archive:false }).populate("user")
        res.send(success("User Recipe Fetched", data))
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

exports.get_user_post = async function (req, res) {
    try {
        const data = await Post.find({ user: req.user._id , archive:false})
            .populate({ path: 'user', select: 'fullname profile' })
            .populate({ path: 'relatedRecipe', select: 'title image hashtag' })
            .sort({ createdDate: -1 }).limit(25)
        res.send(success("User Post Fetched", data))
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

exports.get_user_saved_recipe = async function (req, res) {
    try {
        const data = await User.findById(req.user._id).select("savedRecipe").populate("savedRecipe")
        res.send(success("User Recipe Fetched", getUnarchivedRecipe(data.savedRecipe)))
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

exports.saved_recipe = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.recipeId })
        console.log(recipe)
        const user = await User.findOne({ _id: req.user._id }).select("savedRecipe")
        if (recipe) {
            if (user.savedRecipe.includes(recipe._id)) {
                user.savedRecipe.pull(recipe._id)
                await user.save()
                res.json(success("Recipe Removed"))
            } else {
                user.savedRecipe.push(recipe._id)
                await user.save()
                res.json(success("Recipe Saved"))
            }
        } else {
            res.json(failure("Recipe Not Found"))
        }
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

exports.update_user_detail = async function (req, res) {
    try {
        await User.updateOne({ _id: req.user._id }, {
            fullname: req.body.fullname,
            bio: req.body.bio,
            website: req.body.website,
            address: req.body.address,
            phone: req.body.phone,
            gender: req.body.gender,
        })
        res.json(success("User Detail Updated"))
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

exports.change_password = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findOne({ _id: req.user._id }).select("+passwordSetDate")
    // Check is Old Password is valid
    const validLogin = await bcrypt.compare(oldPassword, user.password)
    if (validLogin) {
        const salt = await bcrypt.genSalt(10)
        // Create new password
        const hashed = await bcrypt.hash(newPassword, salt)
        user.passwordSetDate = new Date()
        user.password = hashed
        await user.save()
        res.json(success("Password Changed"))
    }
    else {
        res.json(failure())
    }
    res.end()
}

exports.view_other_profile = async function (req, res) {
    try {
        const fetchUser = await User.findOne({ _id: req.params.id })
        const data = fetchUser.toObject()
        data["post"] = await Post.find({ user: req.params.id }).populate("user relatedRecipe")
        data["recipe"] = await Recipe.find({ user: req.params.id, isPosted: true })
        const isFollowed = fetchUser.follower.includes(req.user._id)
        data["isFollowed"] = isFollowed
        res.send(success("User Profile Fetched", data))
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

exports.update_profile_picture = async function (req, res) {
    try {
        const formImage = req.files.profile
        const imagePath = formImage.tempFilePath
        if (formImage.mimetype == "image/png" || formImage.mimetype == "image/jpg" || formImage.mimetype == "image/jpeg") {
            const _id = req.user._id
            const profile = await cloudinary.upload_image(imagePath, _id)
            await User.updateOne({ _id }, { profile })
            res.json(success("Profile Picture Changed"))
        }
        else {
            res.json(failure("Must be png, jpg or jpeg"))
        }
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

exports.follow_user = async function (req, res) {
    try {
        const followerUser = req.user._id
        const followingUser = req.params.id
        const followerUserData = await User.findById(followerUser)
        if (followerUserData.following.includes(followingUser)) {
            await User.findByIdAndUpdate(followerUser, {
                $pull: { following: followingUser }
            })
            await User.findByIdAndUpdate(followingUser, {
                $pull: { follower: followerUser }
            })
            createNotification(followingUser, followerUser, "unfollowed you.")
            res.json(success("Unfollowing Success"))
        }
        else {
            await User.findByIdAndUpdate(followerUser, {
                $push: { following: followingUser }
            })
            await User.findByIdAndUpdate(followingUser, {
                $push: { follower: followerUser }
            })
            createNotification(followingUser, followerUser, "started following you.")
            res.json(success("Following Success"))
        }
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}


module.exports.reset_password = async function(req,res){
    try {
        const email = req.body.email
        const user = await User.findOne({email: email})
        if(user){
            const resetCode = randomIntGenerator(100000, 999999)
            const hashedResetCode =  await bcrypt.hash(resetCode.toString(), 10);
            const resetCodeExpiration = moment().add(24, 'h')
            await User.findByIdAndUpdate(user._id, {
                resetCode: hashedResetCode,
                resetCodeExpiration: resetCodeExpiration.format()
            })
            const textContent = passwordTemplate(user.email, resetCode, resetCodeExpiration.format('MMMM Do YYYY, h:mm:ss a'))
            sendEmail(user.email, user.fullname, textContent)
            res.json(success())
        }
        else{
            res.json(failure("Email doesnot exist"))
        }
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

module.exports.new_password = async function(req,res){
    try {
        const email = req.body.email
        const resetCode = req.body.resetCode
        const password = req.body.newPassword
        const user = await User.findOne({email: email}).select("resetCode resetCodeExpiration password")
        if(user){
            if(user.resetCode){
                const isValid = await bcrypt.compare(resetCode, user.resetCode);
                if(isValid ){
                    const now = moment(Date.now()).format()
                    const expiration = user.resetCodeExpiration
                    const remainingTime = -(moment(now).diff(expiration, 's'))
                    console.log(now, expiration,remainingTime)
                    if(remainingTime>0){
                        const salt = await bcrypt.genSalt(10);
                        const hashed = await bcrypt.hash(password, salt);
                        user.password = hashed
                        res.json(success("Password Reset"))
                    }
                    else{
                        res.json(failure("Reset Code Expired"))
                    }
                    user.resetCode = null
                    user.resetCodeExpiration = null
                    user.save()
                }
                else{
                    res.json(failure("Invalid reset code"))
                }
            }
            else{
                res.json(failure("Reset Code does not exist"))
            }
        }
        else{
            res.json(failure("Reset Code does not exist"))
        }
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

module.exports.validate_email = async function(req,res){
    try {
        const email = req.body.email
        const user = await User.findOne({email: email})
        if(user){
            res.json(success())
        }
        else{
            res.json(failure("Email does not exist"))
        }
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

module.exports.get_user_followers = async function(req,res){
    try {
        const user = await User.findOne({ _id: req.user._id }).populate("follower")
        res.send(success("Followers Fetched", user.follower))
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}
module.exports.get_user_following = async function (req, res) {
    try {
        const user = await User.findOne({ _id: req.user._id }).populate("following")
        res.send(success("Following Fetched", user.following))
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}