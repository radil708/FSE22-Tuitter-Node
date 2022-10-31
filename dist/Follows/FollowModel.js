"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FollowSchema_1 = require("./FollowSchema");
/**
 * The mongoose model used to interact with the database
 */
const FollowModel = mongoose_1.default.model('FollowModel', FollowSchema_1.default);
exports.default = FollowModel;
//# sourceMappingURL=FollowModel.js.map