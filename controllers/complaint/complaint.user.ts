import { Request,Response } from "express";
import s3 from "../../config/s3";

export const addComplaint = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}

export const editComplaint = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}

export const getAllUserComplaints = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}
