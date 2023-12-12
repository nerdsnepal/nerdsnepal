const RatingC = require("../../controller/rating")
const { AuthenticationToken } = require("../../middleware/authToken")

const app = require("express").Router()

app.post("/",AuthenticationToken,RatingC.rate)

module.exports = app 