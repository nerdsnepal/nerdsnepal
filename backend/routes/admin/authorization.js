const { AuthenticationToken } = require("../../middleware/authToken")
const { AddAuthorizationMiddleware, AddAuthorization } = require("../../middleware/authorizationMiddleware")


const app = require("express").Router()

app.post("/",AuthenticationToken,AddAuthorizationMiddleware,AddAuthorization)


module.exports = app