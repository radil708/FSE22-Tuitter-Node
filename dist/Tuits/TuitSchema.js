"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * This is the TuitSchema. This will match the format of every entry
 * in the 'Tuits' collection from the database
 */
const TuitSchema = new mongoose_1.default.Schema({
    tuit: { type: String, required: true },
    postedOn: Date,
    // This stores reference to something that lives
    // in another collection
    postedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    stats: {
        replies: { type: Number, default: 0 },
        retuits: { type: Number, default: 0 },
        likes: { type: Number, default: 0 }
    }
}, { collection: "Tuits" });
exports.default = TuitSchema;
//# sourceMappingURL=TuitSchema.js.map