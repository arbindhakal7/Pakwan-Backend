const Restaurant = require("../models/Restaurant")
const Review = require("../models/Review")
const { success, failure } = require("../utils/message.js")
const cloudinary = require('../utils/cloudinary.js')

module.exports.add_restaurant = async function (req, res) {
    console.log("Your details:-->",req.body)
    try {
        const userId = req.user._id
        if (req.files !== undefined) {
            const formImage = req.files.image
            const imagePath = formImage.tempFilePath
            if (formImage.mimetype == "image/png" || formImage.mimetype == "image/jpg" || formImage.mimetype == "image/jpeg") {
                const image = await cloudinary.upload_image(imagePath, userId)
                const restaurant = new Restaurant({
                    user: userId,
                    name: req.body.name,
                    description: req.body.description,
                    phone: req.body.phone,
                    openingTime: req.body.openingTime,
                    closingTime: req.body.closingTime,
                    address: req.body.address,
                    image: image
                })
                const savedRestaurant = await restaurant.save()
                res.json(success("New Restaurant with Image Added", savedRestaurant))
            }
            else {
                res.json(failure("Must be png, jpg or jpeg"))
            }
        }
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}

module.exports.update_restaurant_cover_image = async function (req, res) {
    try {
        const formImage = req.files.image
        const imagePath = formImage.tempFilePath
        if (formImage.mimetype == "image/png" || formImage.mimetype == "image/jpg" || formImage.mimetype == "image/jpeg") {
            const _id = req.params.id
            const coverImage = await cloudinary.upload_image(imagePath, _id)
            await Restaurant.updateOne({ _id }, { coverImage })
            res.json(success("Restaurant Cover Image Changed"))
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
module.exports.edit_restaurant_without_image = async function (req, res) {
    try {
        await Restaurant.findOneAndUpdate({
            _id: req.params.id
        }, {
                name: req.body.name,
                description: req.body.description,
                phone: req.body.phone,
                openingTime: req.body.openingTime,
                closingTime: req.body.closingTime,
                address: req.body.address
            })
        res.json(success("Updated Restaurant Details without image"))
    } catch (error) {
        console.log(error)
        res.send(failure())
    }
    res.end()
}
module.exports.update_restaurant_image = async function (req, res) {
    try {
        const formImage = req.files.image
        const imagePath = formImage.tempFilePath
        if (formImage.mimetype == "image/png" || formImage.mimetype == "image/jpg" || formImage.mimetype == "image/jpeg") {
            const _id = req.params.id
            const image = await cloudinary.upload_image(imagePath, _id)
            await Restaurant.updateOne({ _id }, { image })
            res.json(success("Restaurant Image Changed"))
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
module.exports.get_restaurant_details = async function (req, res) {
    try {
        const user = req.user
        const restaurantId = req.params.id
        let restaurant = await Restaurant.findById(restaurantId)
        if (restaurant) {
            const data = restaurant.toObject()
            data["review"] = await Review.find({ restaurant: restaurantId }).populate("user")
            res.json(success("Restaurant Found", data))
        }
        else {
            res.json(failure("Restaurant not found"))
        }
    } catch (error) {
        console.log(error)
        res.json(failure())
    }
    res.end()
}

module.exports.delete_restaurant = async function (req, res) {
    try {
        await Restaurant.deleteOne({ _id: req.params.id, user: req.user._id })
        res.json(success("Restaurant Deleted"))
    }
    catch (e) {
        console.log(e)
        res.json(failure())
    }
    res.end()
}