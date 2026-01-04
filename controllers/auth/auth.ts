import { Request,Response } from "express";
import { newUserSchema, userLoginSchema } from "../../zod/auth";


export const loginUser = async (req:Request,res:Response) => {
    try {
        const validateData = userLoginSchema.safeParse(req.body)
        if(!validateData.success) return res.status(400).json({success:false,messsage:"Validation failed, bad request"})
        const {
            email,
            password
        } = validateData.data
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}


export const registerUser = async (req:Request,res:Response) => {
    try {
        const validateData = newUserSchema.safeParse(req.body)
        if(!validateData.success){
            return res.status(400).json({
                success:false,
                message:"Validation failed, bad request"
            })
        }
        const {
            email,
            name,
            phoneNumber,
            password
        } = validateData.data
        //db call to register the mofo
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}

export const logout = async (req:Request,res:Response) => {
    try {
        //handle using the cookie lad
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}

export const me = async (req:Request,res:Response) => {
    try {
        //handle using the cookie lad
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:(error as Error).message
        })
    }
}