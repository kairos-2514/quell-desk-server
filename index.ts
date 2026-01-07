import express from "express"
import dotenv from "dotenv"
 
import cors from "cors"
import limiter from "./utils/ratelimiter"
import userAuthRouter from "./routes/auth/auth"
const app = express()
const port = 4000
dotenv.config()

app.use(express.json());
app.use(cors())

//user routes
app.use("/",limiter,userAuthRouter)


//
app.listen(port,()=>{
    console.log("server started in satyam",port);
    
}) 