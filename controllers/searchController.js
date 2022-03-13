const Recipe = require("../models/Recipe")
const User= require("../models/User")
const {success, failure} = require("../utils/message.js")

exports.search_user_and_recipe = async function(req,res){
    try {
        const pattern = req.body.pattern
        if(pattern[0]=="#"){
            const tag = pattern.substring(1,pattern.length)
            const recipeList = await Recipe.find({hashtag: {$in: [tag]}, isPosted: true })
            const data= {
                user: [],
                recipe: recipeList
            }
            res.json(success("Fetch users and recipe", data))
        }
        else{
            const userList = await User.find({fullname: {$regex: pattern, $options:"$i" }})
            const recipeList = await Recipe.find({title: {$regex: pattern, $options:"$i" }, isPosted: true })
            const data= {
                user: userList,
                recipe: recipeList
            }
            res.json(success("Fetch users and recipe", data))
        }
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}
