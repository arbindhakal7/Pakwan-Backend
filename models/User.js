const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
    },
    passwordSetDate: {
        // For Password Change Option
        type: Date,
        default: Date.now,
        select: false
    },
    joinedDate: {
        type: Date,
        default: Date.now,
        select: false
    },
    fullname: {
        type: String,
        default: "",
        get: capitalize
    },
    address: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    profile: {
        type: String
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'hidden'],
        default: "hidden"
    },
    bio: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    resetCode: {
        type: String,
        default: null,
        select: false
    },
    resetCodeExpiration: {
        type: Date,
        default: null,
        select: false
    },
    follower: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    savedRecipe: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            select: false
        }
    ],
    recentlyViewed:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        select: false
        }
        ],
}, { toJSON: { getters: true } })

function capitalize(name){
    return name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

module.exports = mongoose.model("User", userSchema);