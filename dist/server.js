"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const UserController_1 = require("./Users/UserController");
const UserDao_1 = require("./Users/UserDao");
const TuitController_1 = require("./Tuits/TuitController");
const LikeController_1 = require("./Likes/LikeController");
const FollowController_1 = require("./Follows/FollowController");
const BookmarkController_1 = require("./Bookmarks/BookmarkController");
const MessagesController_1 = require("./Messages/MessagesController");
//iter 1
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/*************    Connect To Remote MongoDB Database    *****************/
//
/*IMPORTANT** Make sure environment variable set up before running
i.e. for aws elastic beanstalk deployment:
    eb setenv DB_CLUSTER_USERNAME=<username>
on local ubuntu use cmd:
    export DB_CLUSTER_USERNAME=<username>
 */
let runLocal = true;
let DB_USERNAME;
let DB_PASSWORD;
if (!runLocal) {
    DB_USERNAME = process.env.DB_CLUSTER_USERNAME;
    DB_PASSWORD = process.env.DB_CLUSTER_PASSWORD;
}
else {
    DB_USERNAME = "adilr";
    DB_PASSWORD = "F22SoftEng";
}
const DB_PROTOCOL = "mongodb+srv";
const ENDING_QUERY = "retryWrites=true&w=majority";
// Get this from Connect Application section of MongoDB Atlas online
const HOST = "f22-softeng-cluster0.cxnwsxd.mongodb.net";
// create this db in MongoDB via connection with MongoDB Compass GUI
const DB_NAME = "fsd";
const connectionString = DB_PROTOCOL + "://" + DB_USERNAME + ":" + DB_PASSWORD + "@" + HOST +
    "/" + DB_NAME + "?" + ENDING_QUERY;
mongoose.connect(connectionString);
/*************    Setup Default Page    *****************/
function defaultPage(req, res) {
    res.send('Welcome to Ramzi\'s Fall2022 SoftEng Home Page');
}
app.get('/', defaultPage);
UserDao_1.default.getInstance();
/*************    Connect To app to custom api via controllers    *****************/
const userController = new UserController_1.default(app);
const tuitConroller = new TuitController_1.default(app);
const likeControoler = new LikeController_1.default(app);
const followController = new FollowController_1.default(app);
const bookmarkController = new BookmarkController_1.default(app);
const messageController = new MessagesController_1.default(app);
const PORT = 4000;
app.listen(process.env.PORT || PORT);
//# sourceMappingURL=server.js.map