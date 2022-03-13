const router = require('express').Router();
const auth = require("../middleware/auth.js");
const userController = require('../controllers/userController.js');

router.post("/register", userController.register_new_user);

router.post("/login", userController.login_user);

router.post("/savedRecipe/:recipeId", auth.verifyUser, userController.saved_recipe)

router.get("/", auth.verifyUser, userController.get_user_detail);

router.get("/post",auth.verifyUser, userController.get_user_post);

router.get("/recipe",auth.verifyUser, userController.get_user_recipe);

router.get("/savedRecipe",auth.verifyUser, userController.get_user_saved_recipe);

router.patch("/password", auth.verifyUser, userController.change_password)

router.patch("/", auth.verifyUser, userController.update_user_detail);

router.patch("/profile", auth.verifyUser, userController.update_profile_picture)

router.patch("/follow/:id", auth.verifyUser, userController.follow_user)

router.get("/followers", auth.verifyUser, userController.get_user_followers)

router.get("/following", auth.verifyUser, userController.get_user_following)

router.get("/:id", auth.verifyUser, userController.view_other_profile)

router.post("/reset", userController.reset_password)

router.patch("/new-password", userController.new_password)

router.post("/validate-email", userController.validate_email)

module.exports = router;