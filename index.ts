import express from "express"
import dotenv from "dotenv"

const app = express()
const port = 4000
dotenv.config()

app.use(express.json());





app.listen(port,()=>{
    console.log("server started in satyam",port);
    
}) 