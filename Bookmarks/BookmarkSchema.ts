import mongoose from "mongoose";

/**
 * This defines teh format for each entry in the Bookmarks collection
 */
const BookmarkSchema = new mongoose.Schema({
    bookmarkedTuit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TuitModel'
    },
    bookmarkedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }
}, {collection: 'Bookmarks' })

export default BookmarkSchema;