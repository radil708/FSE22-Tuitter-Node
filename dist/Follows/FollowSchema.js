"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Defines what each entry in the Follows collection looks like
 */
const FollowSchema = new mongoose_1.default.Schema({
    userFollowed: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    userFollowing: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserModel'
    }
}, { collection: 'Follows' });
exports.default = FollowSchema;
//# sourceMappingURL=FollowSchema.js.map