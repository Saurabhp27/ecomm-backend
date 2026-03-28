const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", orderRoutes)
app.listen("5003", ()=> console.log("order service listening on 5003"));