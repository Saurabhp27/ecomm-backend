import dotenv from 'dotenv';
import express from 'express'
import { userProxy } from './routes/userProxy.js';
import { orderProxy } from './routes/orderProxy.js';
import cors from "cors"
import authMiddleware from './middleware/authMiddleWare.js';

dotenv.config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("API GATEWAY RUNNING");
})

app.use("/users", userProxy);
app.use("/orders", authMiddleware ,orderProxy);

const port = process.env.PORT;
app.listen(port, () => console.log(`listening on Port ${port}`));