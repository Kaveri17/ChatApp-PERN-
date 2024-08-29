import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cookieParser from "cookie-parser"

import dotenv from "dotenv"
import { app, server } from "./socket/socket.js"
dotenv.config()

const PORT = process.env.PORT || 8000
// const app = express()

app.use(cookieParser())// for parsing coookies
app.use(express.json()) //for parsing application/json

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

server.listen(PORT, () =>{
    console.log("Server is running on port " + PORT)
})
