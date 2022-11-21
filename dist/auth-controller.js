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
const UserDao_1 = require("./Users/UserDao");
const debugHelper_1 = require("./debugHelper");
const bcrypt = require('bcrypt');
const saltRounds = 10;
class AuthenticationController {
    constructor(appIn) {
        this.userDao = UserDao_1.default.getInstance();
        this.app = appIn;
        //this.userDao = UserDao.getInstance()
        this.app.post('/api/auth/signup', this.signUp);
        this.app.post('/api/auth/profile', this.profile);
        this.app.post('/api/auth/logout', this.logout);
        this.app.post('/api/auth/login', this.login);
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //set to true to see debug statements
            let printDebug;
            //printDebug = true;
            let sendError = false;
            let error;
            const uDao = UserDao_1.default.getInstance();
            const user = req.body;
            const username = user.username;
            const password = user.password;
            // if properties not available send error message
            if (username == null || password == null) {
                sendError = true;
                error = { "Error": "Missing username or password property" };
            }
            //set up some variables
            let doesUserAlreadyExist;
            let existingUser;
            let match;
            // no error so fat
            if (sendError == false) {
                //see if username already taken
                doesUserAlreadyExist = yield uDao.userNameAlreadyTaken(username);
                //if user does not exist send error
                if (doesUserAlreadyExist == false) {
                    sendError = true;
                    error = { "Error": "user with username " + username + " does not exist" };
                }
                // if user does exist
                else {
                    //find user entry in database
                    existingUser = yield uDao.findUserbyUserName(username);
                    // compare encrypted passwords
                    match = yield bcrypt.compare(password, existingUser.getPassword());
                    //found profile with matching password
                    if (match == true) {
                        existingUser.setPassword("*******");
                        req.session['profile'] = existingUser;
                    }
                }
            }
            if (sendError == true) {
                res.sendStatus(403);
            }
            else if (match == true && existingUser != null) {
                res.json(existingUser);
            }
            else {
                throw EvalError("Something went wrong line 80 auth-controller");
            }
            if (printDebug == true) {
                console.log("Request Body -> ", req.body);
                console.log("Send status of response = ", res.statusCode);
                console.log("Status message of response -> ", res.statusMessage);
                let resp;
                if (sendError) {
                    resp = error;
                }
                else {
                    resp = existingUser;
                }
                console.log("Response sent -> ", resp);
                console.log("Session info -> ", req.session);
                debugHelper_1.default.printEnd('login', 'AuthenticationController');
            }
        });
    }
    profile(req, res) {
        const profile = req.session['profile'];
        if (profile != undefined) {
            profile.password = "";
            res.json(profile);
            return;
        }
        else {
            res.sendStatus(403);
        }
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let printDebug;
            printDebug = true;
            req.session.destroy(function (err) {
                console.log("Destroyed session/called logout method"); // TODO this method needed a function not sure why, ask
            });
            res.sendStatus(200);
            if (printDebug == true) {
                console.log("Session info after callinng desroy -> ", req.session);
                debugHelper_1.default.printEnd('logout', 'AuthenticationController');
            }
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let printDebug;
            //printDebug = true; // uncomment this line to see debug statements
            const uDao = UserDao_1.default.getInstance();
            // username and password must be in request body
            let wholeRequest = req.body;
            const usernameReg = req.body.username;
            const passwordReg = req.body.password;
            let sendError = false;
            let error;
            // if properties not available send error message
            if (usernameReg == null || passwordReg == null) {
                error = { "Error": "Missing username or password property" };
                sendError = true;
            }
            let hash;
            if (sendError == false) {
                hash = yield bcrypt.hash(passwordReg, saltRounds);
                wholeRequest.password = hash;
                //see if username already taken
                const doesUserAlreadyExist = yield uDao.userNameAlreadyTaken(usernameReg);
                if (doesUserAlreadyExist == true) {
                    error = { "Error": "User already exists, cannot register a new user with the same username" };
                    sendError = true;
                }
            }
            let insertedUser;
            if (sendError == false) {
                insertedUser = yield uDao.createUser(wholeRequest);
                insertedUser.setPassword('');
                //not sure what this is doing// may be ok since app uses sesssion at server
                req.session['profile'] = insertedUser;
            }
            if (sendError == true) {
                res.sendStatus(403);
            }
            else {
                res.json(insertedUser);
            }
            if (printDebug == true) {
                console.log("Request body -> ", req.body);
                console.log("Request after encryption -> ", wholeRequest);
                console.log("Response status code -> ", res.statusCode);
                console.log("Response data payload -> ", insertedUser);
                debugHelper_1.default.printEnd('signup', 'AuthenticationController');
            }
        });
    }
}
exports.default = AuthenticationController;
//# sourceMappingURL=auth-controller.js.map