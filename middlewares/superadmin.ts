import { Request,Response, NextFunction } from "express";


export const superAdminAuth = async (req:Request,res:Response,next:NextFunction) => {
    const token = res.header("superadmmin_token")
     if(!token){
        return res.status(400).json({
            success:false,
            message:"Bad request no token found"
        })
    }
    try {
        //analyze payload and set req.superadminId
    } catch (error) {
        
    }
}