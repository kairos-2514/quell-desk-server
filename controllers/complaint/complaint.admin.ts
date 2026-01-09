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
    } catch (error) {
        
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
    } catch (error) {
        console.error("Error while marking as in progress",error)

    }
}