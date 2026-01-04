import { Request,Response, NextFunction } from "express";


export const userAuth = async (req:Request,res:Response,next:NextFunction) => {
    const token = res.header("an_token")
     if(!token){
        return res.status(400).json({
            success:false,
            message:"Bad request no token found"
        })
    }
    try {
        //analyze payload and set req.userId
    } catch (error) {
        
    }
}