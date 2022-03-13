const router = require('express').Router();
const recipeController = require('../controllers/recipeController.js')
const auth = require('../middleware/auth.js')

router.post("/", auth.verifyUser, recipeController.add_recipe)

router.get("/archive", auth.verifyUser, recipeController.viewArchive)

router.get("/:id",auth.verifyUser, recipeController.get_recipe)

router.patch("/preparation/:id", auth.verifyUser, recipeController.update_preparation)

router.patch("/ingredients/:id", auth.verifyUser, recipeController.update_ingredients)

router.patch("/direction/:id", auth.verifyUser, recipeController.update_direction)

router.patch("/hashtag/:id", auth.verifyUser, recipeController.update_hashtag)

router.delete("/discard/:id", auth.verifyUser, recipeController.discard_recipe)

router.post("/ok/:id", auth.verifyUser, recipeController.post_recipe)

router.post("/share/:id", auth.verifyUser, recipeController.share_recipe)

router.patch("/no-image/:id", auth.verifyUser, recipeController.update_recipe_without_image)

router.post("/archive/:id", auth.verifyUser, recipeController.archive_recipe)

router.post("/ok/:id", auth.verifyUser, recipeController.post_recipe)

router.delete("/:id", auth.verifyUser, recipeController.delete_recipe)

module.exports = router