require('dotenv').config();
const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", orderRoutes)
const port = process.env.PORT;
app.listen(port, ()=> console.log(`order service listening on ${port}`));