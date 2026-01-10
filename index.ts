import express from "express"
import dotenv from "dotenv"
 
import cors from "cors"
import limiter from "./utils/ratelimiter"
import userAuthRouter from "./routes/auth/auth"
import onboardingRouter from "./routes/onboarding"
import complaintRouter from "./routes/complaint"
const app = express()
const port = 4000
dotenv.config()

app.use(express.json());
app.use(cors())

//user routes
app.use("/api/v1/auth",limiter,userAuthRouter)

app.use("/api/v1/onboarding",limiter,onboardingRouter)

app.use("/api/v1/complaint",limiter,complaintRouter)
//admin routes
app.listen(port,()=>{
    console.log("server started on port: ",port);
    
}) 