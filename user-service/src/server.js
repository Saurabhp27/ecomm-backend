import express from 'express'
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);

app.listen(5002, ()=> console.log("listning on Port 5002"));