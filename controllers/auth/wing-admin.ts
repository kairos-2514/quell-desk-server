import { Request, Response } from "express";

export const loginWingAdmin = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const registerWingAdmin = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const logoutSuperAdmin = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const meSuperAdmin = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
