import rateLimit from "express-rate-limit";


const limiter = rateLimit({
    windowMs:5*60*1000,
    max:100,
    standardHeaders:true,
    legacyHeaders:true
})



export default limiter