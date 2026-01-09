import express from "express"
import { removeUser, verifyUser } from "../controllers/user-management-controller"

const managementRouter = express.Router()

managementRouter.put("/approve",verifyUser)

managementRouter.delete("/remove",removeUser)


export default managementRouter