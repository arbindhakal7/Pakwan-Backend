const router = require("express").Router()
const auth = require("../middleware/auth.js")
const reviewController = require("../controllers/reviewController.js")

router.get("/:recipeId", reviewController.get_review_by_recipe_id)

// [User Verification Required] 

router.post("/:recipeId", auth.verifyUser, reviewController.insert_new_review)

router.patch("/:recipeId", auth.verifyUser, reviewController.update_review)

router.delete("/:recipeId/:reviewId", auth.verifyUser, reviewController.delete_review)

module.exports = router