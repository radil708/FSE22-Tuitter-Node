"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BookmarkSchema = new mongoose_1.default.Schema({
    bookmarkedTuit: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'TuitModel'
    },
    bookmarkedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserModel'
    }
}, { collection: 'Bookmarks' });
exports.default = BookmarkSchema;
//# sourceMappingURL=BookmarkSchema.js.map