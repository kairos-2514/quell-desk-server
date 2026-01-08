import { Request, Response } from "express";
import { newUserSchema, userLoginSchema } from "../../zod/auth";
import { createToken, verifyPassword, hashPassword, verifyToken } from "../../tokens/main";
import db from "../../db/db";
import { PutCommand, GetCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const USERS_TABLE = process.env.USERS_TABLE_NAME || "users";

 
const getUserByEmail = async (email: string) => {
    try {
        const command = new GetCommand({
            TableName: USERS_TABLE,
            Key: { email }
        });
        const result = await db.send(command);
        return result.Item;
    } catch (error) {
        throw new Error(`Error fetching user: ${(error as Error).message}`);
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const validateData = newUserSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed, bad request",
                
            });
        }

        const { email, name, phoneNumber, password } = validateData.data;

      
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

    
        const passwordHash = await hashPassword(password);

        const newUser = {
            _id: uuidv4(),
            name,
            email,
            phoneNumber,
            passwordHash,
            status: "verification_pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        
        const command = new PutCommand({
            TableName: USERS_TABLE,
            Item: newUser,
            ConditionExpression: "attribute_not_exists(email)" 
        });

        await db.send(command);
        const token = createToken(newUser._id)
         
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                status: newUser.status
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const validateData = userLoginSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed, bad request",
                 
            });
        }

        const { email, password } = validateData.data;

         
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
 
        const isPasswordValid = await verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
 
        const updateCommand = new UpdateCommand({
            TableName: USERS_TABLE,
            Key: { email },
            UpdateExpression: "SET updatedAt = :now, lastLogin = :now",
            ExpressionAttributeValues: {
                ":now": new Date().toISOString()
            }
        });
        await db.send(updateCommand);
 
        const token = createToken(user._id);
 
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                status: user.status
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
      
        res.clearCookie("auth_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};


export const me = async (req: Request, res: Response) => {
    try {
        // userId is set by authMiddleware
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        // Get user by ID using GSI query
        const command = new QueryCommand({
            TableName: USERS_TABLE,
            IndexName: "UserIdIndex", // GSI name
            KeyConditionExpression: "_id = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        });

        const result = await db.send(command);
        const user = result.Items?.[0];

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                status: user.status,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error("Me endpoint error:", error);
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};