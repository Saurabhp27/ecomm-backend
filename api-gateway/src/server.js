import express from 'express'
import { userProxy } from './routes/userProxy.js';
import { orderProxy } from './routes/orderProxy.js';
import cors from "cors"
import authMiddleWare from './middleware/authMiddleWare.js';

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("API GATEWAY RUNNING");
})

app.use("/users", userProxy);
app.use("/orders", authMiddleWare ,orderProxy);

app.listen(5001, ()=> console.log("listning on Port 5001"));