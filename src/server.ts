// const http = require('http');
import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import {Logger} from "./core/services/logger.service";
import swaggerUi from "swagger-ui-express";
import swaggerApiDoc from "../api.doc.json";

import todoApiRouteController from "./api/routes/todo.api.route";
import accountAPIController from "./api/routes/account.api.route";

const port = process.env.port || 3000;
const app = express();
const router = express.Router();

app.use(morgan("common"));
app.use(bodyParser.json());

app.use("/api/todos", todoApiRouteController);
app.use("/api/account", accountAPIController);
app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(swaggerApiDoc, {explorer: true}));

Logger.ConfigureLogger();
app.listen(port, () => console.log(`Server started .. listening on port ${port}`));
