import User from "./User";


/**
 * This interface declares the methods required by any userDaos.
 * All the methods must return a Promise which allows the
 * program to keep going while waiting for a response
 * from database.
 */
export default interface UserDaoInterface {
    /**
     * Returns an array of Users representing all Users in the database
     */
    findAllUsers(): Promise<User[]>;

    /**
     * Returns a user from the database with an object id
     * matching the uid param passed in the param
     * @param uid {string} the user id of the user you want to find
     */
    findUserById(uid: string): Promise<any>;

    /**
     * Creates a user in the database with all the attributes
     * of param passed in
     * @param user {User} the user you want to add to the database
     */
    createUser(user: User): Promise<User>;

    // /**
    //  * Updates a user in the database with a matching uid to the
    //  * user passed in the para,
    //  * @param uid {string} user id of the user in the databse you want to update
    //  * @param user {User} the user that will replace the target user from
    //  * the database
    //  */
    // updateUser(uid: string, user: User): Promise<number>;

    /**
     * This will delete a user from the database
     * @param uid {string} the user id of the user you want to delete
     */
    deleteUser(uid: string): Promise<number>;
}
