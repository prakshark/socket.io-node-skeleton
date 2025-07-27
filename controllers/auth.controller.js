import ChatUser from "../models/chatUser.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function registerUser(req, res) {
    try {
        const {username, password, confirmPassword} = req.body;
    
        const userWithSameUsername = await ChatUser.findOne({username: username});
        if(userWithSameUsername) {
            return res.status(400).json({
                status: 400,
                message: "Username already exists"
            });
        }
    
        if(password != confirmPassword) {
            return res.status(400).json({
                status: 400,
                message: "Password validation failed"
            });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newChatUser = new ChatUser({
            username: username,
            password: hashedPassword
        });
        await newChatUser.save();
        return res.status(201).json({
            status: 201,
            message: "New user registered",
            newUser: newChatUser
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Server error in registering the user"
        })
    }
}

export async function loginUser(req, res) {
    try {
        const {username, password} = req.body;
    
        const userWithSameUsername = await ChatUser.findOne({username: username});
        if(!userWithSameUsername) {
            return res.status(404).json({
                status: 404,
                message: "User with this username does not exists"
            });
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, userWithSameUsername.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({
                status: 400,
                message: "Incorrect password provided"
            });
        }
    
        // Create token and store in cookie :-
        const secretkey = process.env.SECRET_KEY;
        const token = jwt.sign({
            id: userWithSameUsername._id,
            username: userWithSameUsername.username
        }, secretkey, {expiresIn: "3h"});
        res.cookie("AuthCookie", token);
        return res.status(200).json({
            status: 200,
            message: "Token stored in cookie and user logged in",
            cookie: token
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: `Server error in logging in the user: ${error.message}`
        });
    }
}

export async function logoutUser(req, res) {
    await res.clearCookie("AuthCookie");
    res.status(200).json({
        status: 200,
        message: "Cookie deleted and user logged out successfully"
    })
}