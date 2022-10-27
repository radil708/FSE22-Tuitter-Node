"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TuitSchema_1 = require("./TuitSchema");
/**
 * This is a mongoose model object used specifically to
 * interact with the database using the TuitSchema for entry addition,parsing, ..etc
 */
const TuitModel = mongoose_1.default.model('TuitModel', TuitSchema_1.default);
exports.default = TuitModel;
//# sourceMappingURL=TuitModel.js.map