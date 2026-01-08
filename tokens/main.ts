import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt"

interface AuthPayload extends JwtPayload{
    id:string
}
export const createToken = async (id:string) => {
    return jwt.sign(id as string,process.env.JWT_SECRET as string)
}

export const verifyToken =  (token:string):AuthPayload => {
    const id =jwt.verify(token ,process.env.JWT_SECRET as string) as AuthPayload
    return id
}

export const hashPassword = async (password:string) => {
    const salt = 14
    return bcrypt.hash(password as string,salt)
}

export const verifyPassword = async (password:string, hashedPassword:string) => {
    return bcrypt.compare(password,hashedPassword)
}

