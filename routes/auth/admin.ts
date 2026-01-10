import express, { Request,Response,NextFunction } from "express"; 
import { loginAdmin, logout, me, registerAdmin } from "../../controllers/auth/admin";


const adminAuth  = express.Router()


adminAuth.post("/login",loginAdmin)

adminAuth.post("/register",registerAdmin)

adminAuth.get("/me",me)

adminAuth.post("/logout",logout)

export default adminAuth