import mongoose from "mongoose";
import BookmarkSchema from "./BookmarkSchema";

/**
 * This interacts with the Bookmarks Collections
 */
const BookmarkModel = mongoose.model('BookmarkModel', BookmarkSchema)

export default BookmarkModel;