const router = require('express').Router();
const searchController = require('../controllers/searchController.js')

router.post("/", searchController.search_user_and_recipe)

module.exports=router