import jwt, { decode, JwtPayload } from "jsonwebtoken"

import { Request,Response, NextFunction } from "express"
import prisma from "../db/prisma.js"

interface DecodedToken extends JwtPayload{
    userId:string
}

declare global{
    namespace Express{
        export interface Request{
            user:{
                id: string
            }
        }
    }
}
const protectRoute= async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({error:"Unauthorized - No Token Provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken//verifying the token 

        if(!decoded){
            return res.status(401).json({error: "Unauthorized - Invalid Token"})
        }

        const user = await prisma.user.findUnique({ // find the user through the id present in the token in the jwt
            where:{id:decoded.userId}, // userid present in the decoded token
            select:{id:true, username:true, fullName:true, profilePic:true}, // selecting and showing these only fields to send as a response
        })
        if(!user){
            return res.status(404).json({error:"User not found"})
        }

        req.user = user

        next()
    } catch (error:any) {
        console.log("Error in protectRoute middleware", error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

export default protectRoute
