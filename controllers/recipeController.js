const Recipe = require("../models/Recipe")
const Review = require("../models/Review")
const Post = require("../models/Post")
const { success, failure } = require("../utils/message.js")
const cloudinary = require('../utils/cloudinary.js')

module.exports.get_recipe = async function (req, res) {
    try {
        const user = req.user
        const recipeId = req.params.id
        let recipe = await Recipe.findById(recipeId)
        if (recipe) {
            if(recipe.user.toString() != req.user._id.toString()){
                const recentlyViewed = user.recentlyViewed;
                const recipeIndex = recentlyViewed.findIndex(
                    recipe => {
                        return recipe.toString() === recipeId
                    },
                )
                if (recipeIndex === -1) {
                    recentlyViewed.unshift(recipeId)
                }
                else{
                    recentlyViewed.pop(recipeId)
                    recentlyViewed.unshift(recipeId)
                }
                console.log(recentlyViewed)
                user.recentlyViewed = recentlyViewed
                user.save()
            }
            const data = recipe.toObject()
            data["review"] = await Review.find({ recipe: recipeId }).populate("user")
            res.json(success("Recipe Found", data))
        }
        else {
            res.json(failure("Recipe not found"))
        }
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

module.exports.add_recipe = async function (req, res) {
    try {
        const userId = req.user._id
        const prevRecipeId = req.body.prevRecipeId
        if (prevRecipeId != "") {
            if (req.files !== undefined) {
                const formImage = req.files.image
                const imagePath = formImage.tempFilePath
                if (formImage.mimetype == "image/png" || formImage.mimetype == "image/jpg" || formImage.mimetype == "image/jpeg") {
                    const image = await cloudinary.upload_image(imagePath, userId)
                    await Recipe.updateOne({ _id: prevRecipeId }, {
                        description: req.body.description,
                        title: req.body.title,
                        image: image
                    })
                    const recipe = await Recipe.findById(prevRecipeId)
                    res.json(success("Previous Recipe Updated with Image Inserted", recipe))
                }
                else {
                    res.json(failure("Must be png, jpg or jpeg"))
                }
            }
        } else {
            if (req.files !== undefined) {
                const formImage = req.files.image
                const imagePath = formImage.tempFilePath
                if (formImage.mimetype == "image/png" || formImage.mimetype == "image/jpg" || formImage.mimetype == "image/jpeg") {
                    const image = await cloudinary.upload_image(imagePath, userId)
                    const recipe = new Recipe({
                        user: userId,
                        description: req.body.description,
                        title: req.body.title,
                        image: image
                    })
                    const savedRecipe = await recipe.save()
                    res.json(success("New Recipe with Image Inserted", savedRecipe))
                }
                else {
                    res.json(failure("Must be png, jpg or jpeg"))
                }
            } else {
                const recipe = new Recipe({
                    user: userId,
                    description: req.body.description,
                    title: req.body.title,
                })
                const savedRecipe = await recipe.save()
                res.json(success("New Recipe Inserted", savedRecipe))
            }
        }
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}

module.exports.update_recipe_without_image = async function (req, res) {
    try {
        const id = req.params.id;
        await Recipe.updateOne({ _id: id }, {
            description: req.body.description,
            title: req.body.title,
        })
        const recipe = await Recipe.findById(id)
        res.json(success("Recipe Edited with no Image", recipe))
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}

module.exports.update_preparation = async function (req, res) {
    try {
        const user = req.user._id
        const recipeId = req.params.id
        const recipe = await Recipe.findById(recipeId)
        const preparationBody = req.body.preparation
        if (recipe.user.toString() == user.toString()) {
            const preparation = {
                preparation: preparationBody.preparation,
                cooking: preparationBody.cooking,
                serving: preparationBody.serving,
                yield: preparationBody.yield
            }
            console.log(preparation)
            recipe.preparation = preparation
            await recipe.save()
            res.send(success("Updated preparation"))
        }
        else {
            res.send(failure("User Not Authorized"))
        }
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}

module.exports.update_ingredients = async function (req, res) {
    try {
        const user = req.user._id
        const recipeId = req.params.id
        const recipe = await Recipe.findById(recipeId)
        if (recipe.user.toString() == user.toString()) {
            recipe.ingredients = req.body.ingredients
            await recipe.save()
            res.send(success("Updated ingredients"))
        }
        else {
            res.send(failure("User Not Authorized"))
        }
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}
module.exports.update_direction = async function (req, res) {
    try {
        const user = req.user._id
        const recipeId = req.params.id
        const recipe = await Recipe.findById(recipeId)
        if (recipe.user.toString() == user.toString()) {
            recipe.direction = req.body.direction
            await recipe.save()
            res.send(success("Updated direction"))
        }
        else {
            res.send(failure("User Not Authorized"))
        }
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}
module.exports.discard_recipe = async function (req, res) {
    try {
        const user = req.user._id
        const recipeId = req.params.id
        const recipe = await Recipe.findById(recipeId)
        if (recipe.user.toString() == user.toString()) {
            await Recipe.findByIdAndDelete(recipeId)
            res.send(success("Discarded Recipe"))
        }
        else {
            res.send(failure("User Not Authorized"))
        }
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}
module.exports.delete_recipe = async function (req, res) {
    try {
        const user = req.user._id
        const recipeId = req.params.id
        const recipe = await Recipe.findById(recipeId)
        if (recipe.user.toString() == user.toString()) {
            await Post.deleteMany({ relatedRecipe: recipeId })
            await Recipe.findByIdAndDelete(recipeId)
            res.send(success("Deleted Recipe Successfully"))
        }
        else {
            res.send(failure("User Not Authorized"))
        }
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}

module.exports.post_recipe = async function (req, res) {
    try {
        const user = req.user._id
        const recipeId = req.params.id
        const recipe = await Recipe.findById(recipeId)
        if (recipe.user.toString() == user.toString()) {
            const post = new Post({
                user: user,
                postType: "recipe",
                relatedRecipe: recipeId
            })
            recipe.isPosted = true
            recipe.save()
            post.save()
            res.send(success("Posted Recipe"))
        }
        else {
            res.send(failure("User Not Authorized"))
        }
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}

module.exports.share_recipe = async function (req, res) {
    try {
        const user = req.user._id
        const recipeId = req.params.id
        const post = new Post({
            user: user,
            postType: "share",
            relatedRecipe: recipeId
        })
        await post.save()
        res.send(success("Shared Recipe"))
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}

module.exports.archive_recipe = async function (req, res) {
    try {
        const user = req.user._id
        const recipeId = req.params.id
        const recipe = await Recipe.findOne({ user: user, _id: recipeId })
        const toArchive = !recipe.archive
        const result = await Post.updateMany({ relatedRecipe: recipeId }, {
            systemArchive: toArchive
        })
        console.log(result)
        recipe.archive = !recipe.archive
        await recipe.save()
        res.send(success("Recipe Archived"))
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}

module.exports.viewArchive = async function (req, res) {
    try {
        const recipe = await Recipe.find({ user: req.user._id, archive: true })
        res.json(success("Get Archived Recipe", recipe))
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}

module.exports.update_hashtag = async function (req, res) {
    try {
        const user = req.user._id
        const recipeId = req.params.id
        const recipe = await Recipe.findById(recipeId)
        if (recipe.user.toString() == user.toString()) {
            recipe.hashtag = req.body.hashtag
            await recipe.save()
            res.send(success("Updated hashtag"))
        }
        else {
            res.send(failure("User Not Authorized"))
        }
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}