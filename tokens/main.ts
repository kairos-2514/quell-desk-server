import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


export const createToken = async (id:String) => {
    return jwt.sign(id as string,process.env.JWT_SECRET as string)
}

export const verifyToken = async (id:String) => {
    return jwt.verify(id as string,process.env.JWT_SECRET as string)
}

export const hashPassword = async (password:String) => {
    const salt = 14
    return bcrypt.hash(password as string,salt)
}

export const verifyPassword = async (password:String, hashedPassword:string) => {
    return bcrypt.compare(password,hashedPassword)
}

