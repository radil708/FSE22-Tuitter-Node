"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LikeSchema = new mongoose_1.default.Schema({
    likedTuit: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'TuitModel'
    },
    likedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserModel'
    }
}, { collection: "Likes" });
exports.default = LikeSchema;
//# sourceMappingURL=LikeSchema.js.map