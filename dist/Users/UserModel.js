"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema_1 = require("./UserSchema");
/**
 * This is a mongoose model object used specifically to interact
 * with the database using the UsersSchema for entry addition,parsing, ..etc
 */
const UserModel = mongoose_1.default.model('UserModel', UserSchema_1.default);
exports.default = UserModel;
//# sourceMappingURL=UserModel.js.map