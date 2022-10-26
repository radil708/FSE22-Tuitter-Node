"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const UserController_1 = require("./Users/UserController");
const UserDao_1 = require("./Users/UserDao");
const app = express();
const mongoose = require('mongoose');
/*************    Connect To Remote MongoDB Database    *****************/
/*IMPORTANT** Make sure environment variable set up before running
i.e. for aws elastic beanstalk deployment:
    eb setenv DB_CLUSTER_USERNAME=<username>
on local ubuntu use cmd:
    export DB_CLUSTER_USERNAME=<username>
 */
const DB_USERNAME = process.env.DB_CLUSTER_USERNAME;
const DB_PASSWORD = process.env.DB_CLUSTER_PASSWORD;
const DB_PROTOCOL = "mongodb+srv";
const ENDING_QUERY = "retryWrites=true&w=majority";
// Get this from Connect Application section of MongoDB Atlas online
const HOST = "f22-softeng-cluster0.cxnwsxd.mongodb.net";
// create this db in MongoDB via connection with MongoDB Compass GUI
const DB_NAME = "fsd";
const connectionString = DB_PROTOCOL + "://" + DB_USERNAME + ":" + DB_PASSWORD + "@" + HOST +
    "/" + DB_NAME + "?" + ENDING_QUERY;
mongoose.connect(connectionString);
function defaultPage(req, res) {
    res.send('Welcome to Ramzi\'s Fall2022 SoftEng Home Page');
}
app.get('/', defaultPage);
const userDaoInstance = new UserDao_1.default();
const userController = new UserController_1.default(app, userDaoInstance);
const PORT = 4000;
app.listen(process.env.PORT || PORT);
//# sourceMappingURL=server.js.map