import * as express from 'express';
import {Request, Response} from "express";

import UserController from "./Users/UserController";
import UserDao from "./Users/UserDao";
import TuitController from "./Tuits/TuitController";
import LikeController from "./Likes/LikeController";
import FollowController from "./Follows/FollowController";
import BookmarkController from "./Bookmarks/BookmarkController";


const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
const DB_NAME = "fsd"

const connectionString = DB_PROTOCOL + "://" + DB_USERNAME + ":" + DB_PASSWORD + "@" + HOST +
    "/" + DB_NAME + "?" + ENDING_QUERY

mongoose.connect(connectionString)


/*************    Setup Default Page    *****************/
function defaultPage (req: Request, res: Response) {
    res.send('Welcome to Ramzi\'s Fall2022 SoftEng Home Page')
}

app.get('/',defaultPage)

UserDao.getInstance();

/*************    Connect To app to custom api via controllers    *****************/
const userController = new UserController(app);
const tuitConroller = new TuitController(app);
const likeControoler = new LikeController(app);
const followController = new FollowController(app);
const bookmarkController = new BookmarkController(app);


const PORT = 4000;
app.listen(process.env.PORT || PORT);
