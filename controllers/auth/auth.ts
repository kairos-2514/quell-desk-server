import { Request,Response } from "express";


export const loginUser = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}


export const registerUser = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}

export const logout = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}

export const me = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}