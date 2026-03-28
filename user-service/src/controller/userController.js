import * as userService from "../services/userService.js";

export const registerUser = async (req, res) => {
    try {
    const data = await userService.register(req.body);
    res.status(201).json({ message: "User registered successfully", data });
    }catch (error){
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const data = await userService.login(req.body);
        res.status(200).json({ message: "user Logged in sucessfully", data});
    }
    catch(error){
        res.status(500).json({message: "Login Failed", error});
    }
}