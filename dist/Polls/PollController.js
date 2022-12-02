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
const UserDao_1 = require("../Users/UserDao");
const Poll_1 = require("./Poll");
const PollDao_1 = require("./PollDao");
const debugHelper_1 = require("../debugHelper");
const MongoToClassConverter_1 = require("../MongoToClassConverter");
class PollController {
    constructor(appIn) {
        this.app = appIn;
        this.app.get("/api/polls", this.findAllPolls); // get all poll entries
        this.app.post('/api/polls/users/:uid', this.createPoll); // make a new poll
        this.app.get('/api/polls/:pid', this.findPollById); // find a poll by id
        this.app.delete('/api/polls/:pid', this.deletePollById); // delete a poll by id
        this.app.put('/api/polls/vote/:pid/users/:uid', this.vote); // vote on a poll
        //this.app.put('/api/polls/unvote/:pid/users/:uid', this.unvote)
    }
    findAllPolls(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pDao = PollDao_1.default.getInstance();
            const all_polls = yield pDao.findAll();
            res.send(all_polls);
        });
    }
    createPoll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //get user who posted id
            const userId = req.params.uid;
            let errorMsg = null;
            // Check is userid format correct and that it exists, catch BSONTypeError
            let userIdExists = false;
            try {
                userIdExists = yield UserDao_1.default.getInstance().doesUserIdExist(userId);
            }
            catch (BSONTypeError) {
                let msg = "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer";
                errorMsg = { "Error": msg };
            }
            let dbResp;
            const clientQuestion = req.body.question;
            const clientQAnswerOptions = req.body.options;
            if (userIdExists == true) {
                // check req.body for poll info, question cannot be blank and answer options len must be greater than 0
                if (clientQuestion == null || clientQuestion == '') {
                    errorMsg = { "Error": "question property cannot be null or empty string" };
                }
                if (clientQAnswerOptions.length == 0 || clientQAnswerOptions == null) {
                    errorMsg = { "Error": "options property cannot be empty array or null" };
                }
                if (errorMsg == null) {
                    const userProfile = yield UserDao_1.default.getInstance().findUserById(userId);
                    const pollInstanceNew = new Poll_1.default('', userProfile, clientQuestion, clientQAnswerOptions);
                    dbResp = yield PollDao_1.default.getInstance().createPoll(pollInstanceNew);
                }
                else {
                    dbResp = errorMsg;
                }
            }
            else {
                errorMsg = { "Error": "User with id: " + userId + " does NOT exist in the database" };
                dbResp = errorMsg;
            }
            res.json(dbResp);
            let printDebug = false; // set to true to print debug statements
            if (printDebug) {
                if (errorMsg == null) {
                    console.log("No error message sent");
                }
                else {
                    console.log("Encountered Error");
                    console.log("error msg -> ", errorMsg);
                }
                console.log("Client Request User id -> ", userId);
                console.log("Does user exist? -> ", userIdExists);
                console.log("Response to client -> ", dbResp);
                debugHelper_1.default.printEnd("createPoll", "PollController");
            }
        });
    }
    findPollById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errorMsg;
            const pollIdTarget = req.params.pid;
            const conv = new MongoToClassConverter_1.MongoToClassConverter();
            let dbResp;
            try {
                dbResp = yield PollDao_1.default.getInstance().findPollById(pollIdTarget);
            }
            catch (BSONTypeError) {
                let msg = "Format is incorrect for pid\n" + "pid must be a string of 12 bytes or a string of 24 hex characters or an integer";
                errorMsg = { "Error": msg };
            }
            let controllerResp;
            // format of id is NOT correct
            if (errorMsg != null) {
                controllerResp = errorMsg;
            }
            // format of id is correct
            else {
                // ID does NOT exist in database
                if (dbResp == null || dbResp.length == 0) {
                    errorMsg = { "Error": "there is no poll with id: " + pollIdTarget + " in the database" };
                    controllerResp = errorMsg;
                }
                // id DOES exist!
                else {
                    controllerResp = dbResp;
                }
            }
            res.json(controllerResp);
            let printDebug = false;
            if (printDebug) {
                console.log("Queried poll id: ", pollIdTarget);
                if (errorMsg == null) {
                    console.log("No error message sent");
                }
                else {
                    console.log("Encountered Error");
                    console.log("Error msg sent -> ", errorMsg);
                }
                console.log("controller response:\n ", controllerResp);
                debugHelper_1.default.printEnd("findPollById", "PollController");
            }
        });
    }
    deletePollById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetPollId = req.params.pid;
            const deletedCount = PollDao_1.default.getInstance().deletePollById(targetPollId);
            res.json({ "pollsDeleted": deletedCount });
        });
    }
    vote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetPollId = req.params.pid;
            const targetUserId = req.params.uid;
            const clientAnswer = req.body.response; //answer should be part of response property
            // body should have an answer property
            // that matches one of the answer options
            let pollObjInstance;
            let errorMsg = null;
            let doesPollExist = false;
            let doesUserExist;
            //****** CHECK POLL ID FORMAT CORRECT AND POLL ID EXISTS *******//
            try {
                pollObjInstance = yield PollDao_1.default.getInstance().findPollById(targetPollId);
            }
            catch (BSONTypeError) {
                let msg = "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer";
                errorMsg = { "Error": msg };
            }
            let targetPoll;
            // if format is correct check if poll id exists in database
            if (errorMsg == null) {
                // poll DOES exist in database
                if (pollObjInstance != null) {
                    targetPoll = pollObjInstance;
                    doesPollExist = true;
                }
                // Poll does NOT exist in database
                else {
                    errorMsg = { "Error": "Poll with id " + targetPollId + " does NOT exist in database" };
                }
            }
            //****** CHECK USER ID FORMAT CORRECT AND USER EXISTS *******//
            let targetUser;
            // if poll does exist check user exists
            if (doesPollExist == true) {
                // check if userid format is correct
                try {
                    targetUser = yield UserDao_1.default.getInstance().findUserById(targetUserId);
                }
                catch (BSONTypeError) {
                    let msg = "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer";
                    errorMsg = { "Error": msg };
                }
                // format correct but user does not exist in database
                if (targetUser == null || targetUser.length == 0) {
                    doesUserExist = false;
                    errorMsg = { "Error": "User with id: " + targetUserId + " does NOT exist in the database" };
                }
                else {
                    doesUserExist = true;
                }
            }
            //****** CHECK IF RESPONSE IS ONE OF THE OPTIONS ******//
            let isResponseValid = false;
            let matchingResponseIndex;
            let arrValidAnswers;
            if (doesPollExist == true && doesUserExist == true) {
                // if response is not null or empty string check it's a response option
                if (clientAnswer != null && clientAnswer != "") {
                    arrValidAnswers = targetPoll.getAllOptions();
                    for (let i = 0; i < arrValidAnswers.length; i++) {
                        if (arrValidAnswers[i] == (clientAnswer)) {
                            isResponseValid = true;
                            matchingResponseIndex = i;
                            break;
                        }
                    }
                }
            }
            if (isResponseValid == false) {
                errorMsg = { "Error": "Response: " + clientAnswer + " is NOT a valid option, options are " + arrValidAnswers.toString() };
            }
            //******* MAKE RESPONSE BASED ON PAST 3 CHECKS ******** //
            let controllerResp;
            // if any check fails
            if (doesPollExist == false || doesUserExist == false || isResponseValid == false) {
                controllerResp = errorMsg;
            }
            //all checks pass
            else {
                //TODO delete
                //TODO delete
                console.log("current options count: ", targetPoll.getAnswerOptionsCount());
                //TODO @Lauryn Responder_to_user DAO should add entry to collection here
                targetPoll.incrementVote(matchingResponseIndex);
                // updates the vote
                //todo delete
                //console.log("after incrementation", targetPoll)
                controllerResp = yield PollDao_1.default.getInstance().updateVote(targetPoll);
            }
            res.json(controllerResp);
            let printDebug = false;
            if (printDebug) {
                console.log("Poll ID from req: ", targetPollId);
                console.log("User Id from req: ", targetUserId);
                console.log("Answer from req: ", clientAnswer);
                if (errorMsg == null) {
                    console.log("No Error encountered");
                }
                else {
                    console.log("Error encountered");
                }
                console.log("Response to client -> ", controllerResp);
            }
        });
    }
    unvote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetPollId = req.params.pid;
            const targetUserId = req.params.uid;
            const clientAnswer = req.body.response; //answer should be part of response property
            // body should have an answer property
            // that matches one of the answer options
            let pollObjInstance;
            let errorMsg = null;
            let doesPollExist = false;
            let doesUserExist;
            //****** CHECK POLL ID FORMAT CORRECT AND POLL ID EXISTS *******//
            try {
                pollObjInstance = yield PollDao_1.default.getInstance().findPollById(targetPollId);
            }
            catch (BSONTypeError) {
                let msg = "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer";
                errorMsg = { "Error": msg };
            }
            let targetPoll;
            // if format is correct check if poll id exists in database
            if (errorMsg == null) {
                // poll DOES exist in database
                if (pollObjInstance == null) {
                    targetPoll = pollObjInstance;
                    doesPollExist = true;
                }
                // Poll does NOT exist in database
                else {
                    errorMsg = { "Error": "Poll with id " + targetPollId + " does NOT exist in database" };
                }
            }
            //****** CHECK USER ID FORMAT CORRECT AND USER EXISTS *******//
            let targetUser;
            // if poll does exist check user exists
            if (doesPollExist == true) {
                // check if userid format is correct
                try {
                    targetUser = yield UserDao_1.default.getInstance().findUserById(targetUserId);
                }
                catch (BSONTypeError) {
                    let msg = "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer";
                    errorMsg = { "Error": msg };
                }
                // format correct but user does not exist in database
                if (targetUser == null || targetUser.length == 0) {
                    doesUserExist = false;
                    errorMsg = { "Error": "User with id: " + targetUserId + " does NOT exist in the database" };
                }
                else {
                    doesUserExist = true;
                }
            }
            //****** CHECK IF RESPONSE IS ONE OF THE OPTIONS ******//
            let isResponseValid = false;
            let matchingResponseIndex;
            let arrValidAnswers;
            if (doesPollExist == true && doesUserExist == true) {
                // if response is not null or empty string check it's a response option
                if (clientAnswer != null && clientAnswer != "") {
                    arrValidAnswers = targetPoll.getAllOptions();
                    for (let i = 0; i < arrValidAnswers.length; i++) {
                        if (arrValidAnswers[i].equals(clientAnswer)) {
                            isResponseValid = true;
                            matchingResponseIndex = i;
                            break;
                        }
                    }
                }
            }
            if (isResponseValid == false) {
                errorMsg = { "Error": "Response: " + clientAnswer + " is NOT a valid option, options are " + arrValidAnswers.toString() };
            }
            //******* MAKE RESPONSE BASED ON PAST 3 CHECKS ******** //
            let controllerResp;
            // if any check fails
            if (doesPollExist == false || doesUserExist == false || isResponseValid == false) {
                controllerResp = errorMsg;
            }
            //all checks pass
            else {
                //TODO @Lauryn Responder_to_user DAO should remove entry to collection here
                targetPoll.decrementVote(matchingResponseIndex);
                // updates the vote
                controllerResp = yield PollDao_1.default.getInstance().updateVote(targetPoll);
            }
            res.json(controllerResp);
            let printDebug = false;
            if (printDebug) {
                console.log("Poll ID from req: ", targetPollId);
                console.log("User Id from req: ", targetUserId);
                console.log("Answer from req: ", clientAnswer);
                if (errorMsg == null) {
                    console.log("No Error encountered");
                }
                else {
                    console.log("Error encountered");
                }
                console.log("Response to client -> ", controllerResp);
            }
        });
    }
    findPollsByAuthor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = PollController;
//# sourceMappingURL=PollController.js.map