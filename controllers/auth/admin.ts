import { Request, Response } from "express";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const logoutAdmin = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
