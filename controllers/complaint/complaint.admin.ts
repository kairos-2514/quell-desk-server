import { Request,Response } from "express";
import { HTTPError } from "../../utils/error";


export const markAsResolved = async (req:Request,res:Response) => {
    try {  
        const adminId = req.adminId
        if(!adminId){
            return res.status(HTTPError.UNAUTHORIZED).json({
                success:false,
                message:"Unauthorized"
            })
        }
        const complaintId = req.body
        if(!complaintId){
            return res.status(HTTPError.BADREQUEST).json({
                success:false,
                message:"Bad request"
            })
        }
        // db call to validate admin
        //main db call
        
    } catch (error) {
        console.error(error)
        return res.status(HTTPError.SERVERERROR).json({
            success:false,
            message:"Internal server error"
        })
    }
}


export const markInProgress = async (req:Request,res:Response) => {
    try {
        const adminId = req.adminId
        if(!adminId){
            return res.status(HTTPError.UNAUTHORIZED).json({
                success:false,
                message:"Unauthorized to access"
            })
        }       
        const complaintId  = req.body
        if(!complaintId){
            return res.status(HTTPError.BADREQUEST).json({
                success:false,
                message:"No complaint id found"
            })
        }
        //db call to validate admin




        //db call to update the complaint based on the id



        //return the updated complaint
    } catch (error) {
        console.error("Error while marking as in progress",error)
        return res.status(HTTPError.SERVERERROR).json({
            success:false,
            message:"Internal server error"
        })
    }
}