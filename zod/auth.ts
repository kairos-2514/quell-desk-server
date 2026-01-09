import z from "zod"

const passwordSchema = z.string().min(8,{message:"Password can not be less than 8 characters"}).max(30,{message:"Password can not be more than 30 characters"})
const nameSchema = z.string().min(5,{message:"Name can not be less than 5 characters"}).max(30,{message:"Name can not be more than 30 characters"})
const phoneNumberSchema = z.string()

export const newUserSchema = z.object({
    email:z.email(),
    password:passwordSchema,
    name:nameSchema,
    phoneNumber:phoneNumberSchema 
})

export const userLoginSchema = z.object({
    email:z.email(),
    password:passwordSchema
})

export const newAdminSchema = z.object({
    email:z.string(),
    password:passwordSchema,
    name:nameSchema
})
export const adminLoginSchema = z.object({
    email:z.string(),
    password:passwordSchema
})
