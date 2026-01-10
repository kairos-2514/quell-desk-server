import { Request,Response } from "express";
import { HTTPError } from "../utils/error";

export const verifyUser = async (req:Request,res:Response) => {
    try {
        const adminId = req.adminId
        if(!adminId){
            return res.status(HTTPError.UNAUTHORIZED).json({
                success:false,
                message:"Admin Id not found"
            })
        }
        const userId = req.body;
        if(!userId){
            return res.status(HTTPError.BADREQUEST).json({
                success:false,
                messsage:"User id not defined"
            })
        }
        //db call to validate admin





        //db call to verify user => change the status string to verified
        
    } catch (error) {
        console.error(error)
        return res.status(HTTPError.SERVERERROR).json({
            success:false,
            message:"Internal server error",
            error:(error as Error).message
        })
    }
}

export const removeUser = async (req:Request,res:Response) => {
    try {
         const adminId = req.adminId
        if(!adminId){
            return res.status(HTTPError.UNAUTHORIZED).json({
                success:false,
                message:"Admin Id not found"
            })
        }
        const userId = req.body;
        if(!userId){
            return res.status(HTTPError.BADREQUEST).json({
                success:false,
                messsage:"User id not defined"
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(HTTPError.SERVERERROR).json({
            success:false,
            message:"Internal server error",
            error:(error as Error).message
        })
    }
}