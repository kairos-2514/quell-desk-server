import { Request, Response } from "express";
import s3 from "../../config/s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import multer from "multer";
import { HTTPError } from "../../utils/error";
 

 
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = "complaints";
const S3_BUCKET = process.env.S3_BUCKET_NAME as string

 
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,  
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
}).array('images', 4); 
 
const uploadImageToS3 = async (file: Express.Multer.File, complaintId: string): Promise<string> => {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `complaints/${complaintId}/${nanoid()}.${fileExtension}`;
    
    const uploadParams = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));
    
      
    return `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`;
};

 
const deleteImageFromS3 = async (imageUrl: string): Promise<void> => {
    const key = imageUrl.split('.amazonaws.com/')[1];
    
    const deleteParams = {
        Bucket: S3_BUCKET,
        Key: key,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));
};

export const addComplaint = async (req: Request, res: Response) => {
    try {
        
        upload(req, res, async (err) => {
            if (err) {
                return res.status(HTTPError.BADREQUEST).json({
                    success: false,
                    message: err.message
                });
            }

            const { title, subject } = req.body;
            const files = req.files as Express.Multer.File[];
            
        
            if (!title || !subject) {
                return res.status(HTTPError.BADREQUEST).json({
                    success: false,
                    message: "Title and subject are required"
                });
            }

             
            const userId = req.userId
            if (!userId) {
                return res.status(HTTPError.UNAUTHORIZED).json({
                    success: false,
                    message: "User not authenticated"
                });
            }

            
            if (!files || files.length === 0) {
                return res.status(HTTPError.BADREQUEST).json({
                    success: false,
                    message: "At least one image is required"
                });
            }

            if (files.length > 4) {
                return res.status(HTTPError.BADREQUEST).json({
                    success: false,
                    message: "Maximum 4 images allowed"
                });
            }

             
            const id = nanoid();
            const c_id = nanoid();
            const timestamp = new Date().toISOString();

            
            const imageUrls: string[] = [];
            try {
                for (const file of files) {
                    const imageUrl = await uploadImageToS3(file, c_id);
                    imageUrls.push(imageUrl);
                }
            } catch (uploadError) {
                
                for (const url of imageUrls) {
                    try {
                        await deleteImageFromS3(url);
                    } catch (deleteError) {
                        console.error(`Failed to delete image ${url}:`, deleteError);
                    }
                }
                throw new Error(`Failed to upload images: ${(uploadError as Error).message}`);
            }

             
            const complaintItem = {
                id, 
                c_id, 
                user_id: userId,  
                title,
                subject,
                imageUrls,
                status: "unresolved",
                createdAt: timestamp,
                updatedAt: timestamp
            };

           
            const putCommand = new PutCommand({
                TableName: TABLE_NAME,
                Item: complaintItem
            });

            await docClient.send(putCommand);

            return res.status(201).json({
                success: true,
                message: "Complaint submitted successfully",
                data: complaintItem
            });
        });
    } catch (error) {
        console.error("Error adding complaint:", error);
        return res.status(HTTPError.SERVERERROR).json({
            success: false,
            message: (error as Error).message
        });
    }
};

export const getAllUserComplaints = async (req: Request, res: Response) => {
    try {
       
        const userId = req.userId
        
        if (!userId) {
            return res.status(HTTPError.UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated"
            });
        }

        // Query DynamoDB using GSI on user_id (you'll need to create a GSI on user_id)
        const queryCommand = new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: "user_id-index", // GSI name - create this in DynamoDB
            KeyConditionExpression: "user_id = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            },
            ScanIndexForward: false // Sort by newest first
        });

        const result = await docClient.send(queryCommand);

        return res.status(200).json({
            success: true,
            message: "Complaints retrieved successfully",
            data: result.Items || [],
            count: result.Count || 0
        });
    } catch (error) {
        console.error("Error fetching complaints:", error);
        return res.status(HTTPError.SERVERERROR).json({
            success: false,
            message: (error as Error).message
        });
    }
};

export const removeComplaint = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // complaint id
        const userId = req.userId

        if (!userId) {
            return res.status(HTTPError.UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated"
            });
        }

        if (!id) {
            return res.status(HTTPError.BADREQUEST).json({
                success: false,
                message: "Complaint ID is required"
            });
        }

        // First, get the complaint to verify ownership and retrieve image URLs
        const queryCommand = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "id = :id",
            FilterExpression: "user_id = :userId",
            ExpressionAttributeValues: {
                ":id": id,
                ":userId": userId
            }
        });

        const queryResult = await docClient.send(queryCommand);

        if (!queryResult.Items || queryResult.Items.length === 0) {
            return res.status(HTTPError.NOTFOUND).json({
                success: false,
                message: "Complaint not found or you don't have permission to delete it"
            });
        }

        const complaint = queryResult.Items[0];
        const imageUrls = complaint.imageUrls as string[];

      
        if (imageUrls && imageUrls.length > 0) {
            for (const url of imageUrls) {
                try {
                    await deleteImageFromS3(url);
                } catch (deleteError) {
                    console.error(`Failed to delete image ${url}:`, deleteError);
                    // Continue deleting other images even if one fails
                }
            }
        }

    
        const deleteCommand = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                id: id,
                c_id: complaint.c_id
            }
        });

        await docClient.send(deleteCommand);

        return res.status(200).json({
            success: true,
            message: "Complaint deleted successfully",
            data: { id }
        });
    } catch (error) {
        console.error("Error removing complaint:", error);
        return res.status(HTTPError.SERVERERROR).json({
            success: false,
            message: (error as Error).message
        });
    }
};