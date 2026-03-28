import express from 'express'
import { userProxy } from './routes/userProxy.js';
import { orderProxy } from './routes/orderProxy.js';
import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API GATEWAY RUNNING");
})

app.use("/users", userProxy);
app.use("/orders", orderProxy);

app.listen(5001, ()=> console.log("listning on Port 5001"));