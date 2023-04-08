const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const messageRoute = require("./routes/messages");
const conversationRoute = require("./routes/conversations");


const cookieParser = require("cookie-parser");
const cors = require("cors");



dotenv.config();

mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("Connected To MongoDB");
});

//Middleware
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json());

app.use(cors({
    origin:["http://localhost:3000","http://localhost:4001"]
}));



app.use(cookieParser());

app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/conversations", conversationRoute)
app.use("/api/messages", messageRoute)



app.listen(8800,()=>{
    console.log("Backend Server Is Running");
})