const auth = require("../middleware/auth.js")
const router = require('express').Router();
const recipeReportController = require("../controllers/recipeReportController.js")

router.post("/:id", auth.verifyUser, recipeReportController.report_recipe)

module.exports = router;