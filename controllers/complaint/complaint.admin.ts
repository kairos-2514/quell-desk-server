import { Request, Response } from "express";
import { HTTPError } from "../../utils/error";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

 
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = "complaints";
const ADMIN_TABLE = "admins";  

export const markAsResolved = async (req: Request, res: Response) => {
    try {
        const adminId = req.adminId;
        if (!adminId) {
            return res.status(HTTPError.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { complaintId } = req.body;
        if (!complaintId) {
            return res.status(HTTPError.BADREQUEST).json({
                success: false,
                message: "Complaint ID is required"
            });
        }

     
        const adminCheckCommand = new GetCommand({
            TableName: ADMIN_TABLE,
            Key: {
                id: adminId
            }
        });

        const adminResult = await docClient.send(adminCheckCommand);
        if (!adminResult.Item) {
            return res.status(HTTPError.UNAUTHORIZED).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        // Check if complaint exists
        const getComplaintCommand = new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                id: complaintId
            }
        });

        const complaintResult = await docClient.send(getComplaintCommand);
        if (!complaintResult.Item) {
            return res.status(HTTPError.NOTFOUND).json({
                success: false,
                message: "Complaint not found"
            });
        }

        
        const updateCommand = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                id: complaintId,
                c_id: complaintResult.Item.c_id
            },
            UpdateExpression: "SET #status = :status, updatedAt = :updatedAt, resolvedBy = :adminId",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": "resolved",
                ":updatedAt": new Date().toISOString(),
                ":adminId": adminId
            },
            ReturnValues: "ALL_NEW"
        });

        const result = await docClient.send(updateCommand);

        return res.status(200).json({
            success: true,
            message: "Complaint marked as resolved",
            data: result.Attributes
        });

    } catch (error) {
        console.error("Error marking complaint as resolved:", error);
        return res.status(HTTPError.SERVERERROR).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const markInProgress = async (req: Request, res: Response) => {
    try {
        const adminId = req.adminId;
        if (!adminId) {
            return res.status(HTTPError.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized to access"
            });
        }

        const { complaintId } = req.body;
        if (!complaintId) {
            return res.status(HTTPError.BADREQUEST).json({
                success: false,
                message: "Complaint ID is required"
            });
        }

       
        const adminCheckCommand = new GetCommand({
            TableName: ADMIN_TABLE,
            Key: {
                id: adminId
            }
        });

        const adminResult = await docClient.send(adminCheckCommand);
        if (!adminResult.Item) {
            return res.status(HTTPError.UNAUTHORIZED).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        // Check if complaint exists
        const getComplaintCommand = new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                id: complaintId
            }
        });

        const complaintResult = await docClient.send(getComplaintCommand);
        if (!complaintResult.Item) {
            return res.status(HTTPError.NOTFOUND).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Update complaint status to "in-progress"
        const updateCommand = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                id: complaintId,
                c_id: complaintResult.Item.c_id
            },
            UpdateExpression: "SET #status = :status, updatedAt = :updatedAt, handledBy = :adminId",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": "in-progress",
                ":updatedAt": new Date().toISOString(),
                ":adminId": adminId
            },
            ReturnValues: "ALL_NEW"
        });

        const result = await docClient.send(updateCommand);

        return res.status(200).json({
            success: true,
            message: "Complaint marked as in progress",
            data: result.Attributes
        });

    } catch (error) {
        console.error("Error while marking as in progress", error);
        return res.status(HTTPError.SERVERERROR).json({
            success: false,
            message: "Internal server error"
        });
    }
};