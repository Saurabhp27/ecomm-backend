import * as userService from "../services/userService.js";
import fs from "fs";
import path from "path";

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

// currently we are not using the jsonwebkey and sending the plain file, later if we face issue of
// keyrotaion, multiple keys, or external auth identity provider. or standardise it is stored in (/.well-known/jwks.json);
export const getPublicKey = async (req, res) => {
    try {
        const publicKeyPath = path.resolve("src/certs/public.pem");
        const publicKey = fs.readFileSync(publicKeyPath, "utf8");
        res.status(200).type("text/plain").send(publicKey);
    } catch (error) {
        res.status(500).json({ message: "Failed to read public key", error: error.message });
    }
}