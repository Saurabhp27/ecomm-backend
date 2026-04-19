import 'dotenv/config';
import express from 'express'
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);

const port = process.env.PORT;
app.listen(port, ()=> console.log(`listening on Port ${port}`));