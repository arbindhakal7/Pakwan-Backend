const express = require('express');
const morgan = require('morgan');
const fileUpload = require("express-fileupload")

// Routes Import
const userRoutes = require('./routes/userRoutes.js')
const postRoutes = require('./routes/postRoutes.js')
const recipeRoutes = require('./routes/recipeRoute.js')
const searchRoutes = require('./routes/searchRoutes')
const commentRoute = require('./routes/commentRoute.js')
const reviewRoutes = require('./routes/reviewRoutes.js')
const postReportRoutes = require('./routes/postReportRoutes.js')
const recipeReportRoutes = require('./routes/recipeReportRoutes.js')
const notificationRoutes = require('./routes/notificationRoutes.js')
const restaurantRoutes = require('./routes/restaurantRoutes.js')

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(fileUpload({ useTempFiles: true }))

app.get("/", (req, res) => {
    res.send("Welcomee to Pakwan API");
    res.end();
})

// Routes
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/recipe", recipeRoutes)
app.use("/search", searchRoutes)
app.use("/comment", commentRoute)
app.use("/review", reviewRoutes)
app.use("/reportPost", postReportRoutes)
app.use("/reportRecipe", recipeReportRoutes)
app.use("/notification", notificationRoutes)
app.use("/restaurant", restaurantRoutes);


module.exports = app