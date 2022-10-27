"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    constructor(app, userDao) {
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // assign variable to store POST JSON body from client
            const newUserJSON = req.body;
            // user model to create a new user in database
            const newUserObject = yield this.userDao.createUser(newUserJSON);
            // add new user JSON info to response?
            res.send(newUserObject);
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //TODO ask, by default params has a
            // userid comes from line18, i.e. the userid in the url
            // this has nothing to do with request JSON
            const userIdToDelete = req.params['userid'];
            let count = 0;
            //console.log(req.params);
            try {
                count = yield this.userDao.deleteUser(userIdToDelete);
            }
            catch (BSONTypeError) {
                let errorMessage = "BSONType Error, userid: " + userIdToDelete + " is INCORRECT format";
                errorMessage += " \nFAILED to DELETE user";
                res.status(400).send(errorMessage);
                return;
            }
            if (count > 0) {
                res.send("SUCCESFULLY DELETED " + count.toString() + " users");
            }
            else {
                res.send("No users with _id: " + userIdToDelete + " found\n0 users deleted");
            }
        });
        this.findAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield this.userDao.findAllUsers();
            // send response JSON
            res.json(allUsers);
        });
        this.findUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // userid comes from url input
            const userIdToFind = req.params['userid'];
            try {
                const targeted_user = yield this.userDao.findUserById(userIdToFind);
                res.json(targeted_user);
            }
            catch (BSONTypeError) {
                let errorMessage = "BSONType Error, userid: " + userIdToFind + " is INCORRECT format";
                errorMessage += " \nFAILED to GET/FIND user";
                res.status(404).send(errorMessage);
            }
        });
        this.findUserbyUserName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let targetUserName = '';
            const userNameTargetOne = req.body['postedBy'];
            const userNameTargetTwo = req.body['username'];
            if (userNameTargetOne.length == 0 || userNameTargetOne == null) {
                if (userNameTargetTwo.length > 0) {
                    targetUserName = userNameTargetTwo;
                }
            }
            else if (userNameTargetTwo.length == 0 || userNameTargetTwo == null) {
                if (userNameTargetOne.length > 0) {
                    targetUserName = userNameTargetOne;
                }
            }
            else {
                let errorMessage = "JSON request body requires {username: value} or {postedBy: value}";
                errorMessage += "\nusername NOT defined, UNABLE to search";
                res.status(404).send(errorMessage);
                return;
            }
            const targetedUser = yield this.userDao.findUserbyUserName(targetUserName);
            res.json(targetedUser);
        });
        this.app = app;
        this.userDao = userDao;
        // Set attributes of app attribute
        this.app.get('/users', this.findAllUsers);
        this.app.get('/users/:userid', this.findUserById);
        this.app.post('/users', this.createUser);
        this.app.delete('/users/:userid', this.deleteUser);
        //this.app.put('/users/:userid', this.updateUser);
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map