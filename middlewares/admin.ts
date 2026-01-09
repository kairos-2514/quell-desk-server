import { Request,Response, NextFunction } from "express";
import { verifyToken } from "../tokens/main";


export const adminAuth = async (req:Request,res:Response,next:NextFunction) => {
    const token = req.cookies.admin_auth_token
     if(!token){
        return res.status(400).json({
            success:false,
            message:"Bad request no token found"
        })
    }
    try {
        //analyze payload and set req.superadminId
        const decoded = verifyToken(token)
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Invalid or expired token"
            })
        }
        req.adminId = await decoded.id
    } catch (error) {
        console.error("Admin auth middleware error",error)
        return res.status(500).json({
            success:false,
            message:"Authentication failed"
        })
    }
}