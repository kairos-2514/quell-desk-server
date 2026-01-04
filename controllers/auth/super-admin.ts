import { Request, Response } from "express";
import { superAdminLoginSchema } from "../../zod/auth";

export const loginSuperAdmin = async (req: Request, res: Response) => {
  try {
    const validateData = superAdminLoginSchema.safeParse(req.body)
    if(!validateData.success){
      return res.status(400).json({
        success:false,
        message:"Bad request"
      })
    }
    const {
      email,
      password
    } = validateData.data
    //db call to check if user exits

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const registerSuperAdmin = async (req: Request, res: Response) => {
  try {
    //adhoc => set 4 profiles
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const logoutSuperAdmin = async (req: Request, res: Response) => {
  try {
    //delete cookie
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const meSuperAdmin = async (req: Request, res: Response) => {
  try {
    //get user details from the cookie 
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
