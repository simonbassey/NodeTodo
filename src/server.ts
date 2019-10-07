// const http = require('http');
import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";

import todoApiRouteController from "./api/routes/todo.api.route";

const port = process.env.port || 3000;
const app = express();

app.use(morgan("common"));
app.use(bodyParser.json());

app.use("/", todoApiRouteController);

app.listen(port, () => { console.log(`Server started .. listening on port ${port}`)});
