import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password donot match" });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
      data: {
        // fullName:fullName, // the syntax of the data storing is this way but since the variable name of both the table column_name and the paramter same we just write it once
        fullName,
        username,
        password: hashedPassword, // the variable name we send is different from the column name of password data so we write it like this
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      },
    });

    if (newUser) {
      // generate token in a sec
      generateToken(newUser.id, res);

      res.status(201).json({
        // sending the response with these user's field
        id: newUser.id,
        fullName: newUser.fullName,
        userName: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error: any) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Sever Error" });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const {username, password} = req.body
    const user = await prisma.user.findUnique({where: {username}})
    if(!user){
      return res.status(400).json({error: "Invalid Username. Please Register"})
    }
    const isPasswordCorrect = await bcryptjs.compare(password,user.password)
    if(!isPasswordCorrect){
      return res.status(400).json({error:"Invalid Password"})
    }
    generateToken(user.id,res)

    res.status(200).json({
      id:user.id,
      fullName:user.fullName,
      username:user.username,
      profilePic: user.profilePic
    })
  } catch (error:any) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Sever Error" });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt","",{maxAge:0}) // here the jwt field is kept empty as we can see from the second parameter we are sending is empty
    res.status(200).json({message:"Logged out successfully."})
  } catch (error:any) {
    console.log("Error in logout controller",error.message)    
    res.status(500).json({error:"Internal Server Error"})
  }
};

export const getMe = async (req:Request, res:Response) =>{
  try {
    const user = await prisma.user.findUnique({where:{id:req.user.id}})

    if(!user){
      return res.status(404).json({ error:"User not found" })
    }

    res.status(200).json({
      id:user.id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    })
    
  } catch (error:any) {
    console.log("Error in getMe controller", error.message)
    res.status(500).json({error:"Internal Server Error"})
  }
}