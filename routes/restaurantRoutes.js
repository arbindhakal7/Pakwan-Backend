const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController.js')
const auth = require('../middleware/auth.js')

router.post("/", auth.verifyUser, restaurantController.add_restaurant)

router.get("/:id",auth.verifyUser, restaurantController.get_restaurant_details)

router.patch("/cover-image/:id", auth.verifyUser, restaurantController.update_restaurant_cover_image)

router.patch("/restaurant-image/:id", auth.verifyUser, restaurantController.update_restaurant_image)

router.patch("/no-image/:id", auth.verifyUser, restaurantController.edit_restaurant_without_image)

router.delete("/:id", auth.verifyUser, restaurantController.delete_restaurant)

module.exports = router