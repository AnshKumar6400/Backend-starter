import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
//e3dprmhcc
const app = express();
dotenv.config();
const PORT =process.env.PORT || "5000";
const rateLimiter = rateLimit({
    windowMs:5*60*1000,
    max:100,
    message: "Too many requests from this IP, please try again after an hour"
})
app.use(rateLimiter);
app.use(express.json({limit:"1mb"}));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors({origin:process.env.CORS_ORIGIN,credentials:true}));

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use(PORT||"5000", ()=>{
`Connected tp ${PORT}`
});