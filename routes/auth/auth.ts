import express from "express"; 
import { loginUser, logout, me, registerUser } from "../../controllers/auth/auth";


const userAuthRouter = express.Router()

userAuthRouter.post("/login",loginUser)

userAuthRouter.post("/register",registerUser)

userAuthRouter.post("/logout",logout)

userAuthRouter.get("/me",me)

export default userAuthRouter