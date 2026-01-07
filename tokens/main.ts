import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


export const createToken = async (id:string) => {
    return jwt.sign(id as string,process.env.JWT_SECRET as string)
}

export const verifyToken = async (id:string) => {
    return jwt.verify(id as string,process.env.JWT_SECRET as string)
}

export const hashPassword = async (password:string) => {
    const salt = 14
    return bcrypt.hash(password as string,salt)
}

export const verifyPassword = async (password:string, hashedPassword:string) => {
    return bcrypt.compare(password,hashedPassword)
}

