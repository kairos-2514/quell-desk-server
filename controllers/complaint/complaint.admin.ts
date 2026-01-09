import { Request,Response } from "express";
import { HTTPError } from "../../utils/error";


export const markAsResolved = async (req:Request,res:Response) => {
    try {
        
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