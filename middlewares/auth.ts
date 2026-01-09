import { Request,Response, NextFunction } from "express";
import { verifyToken } from "../tokens/main";

declare global{
    namespace Express{
        interface Request{
            userId?:string,
            adminId?:string
        }
    }
}
export const userAuth = async (req:Request,res:Response,next:NextFunction) => {
    const token = req.cookies.an_token
     if(!token){
        return res.status(400).json({
            success:false,
            message:"Bad request no token found"
        })
    }
    try {
     const decoded = verifyToken(token)
     if(!decoded){
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        })
     }
     req.userId = await decoded.id
     next()
    } catch (error) {
        console.error("Auth middleware error",error)
        return res.json({
            success:false,
            message:"Authentication failed"
        })
    }
}