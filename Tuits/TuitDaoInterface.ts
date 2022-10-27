import Tuit from "./Tuit";


/**
 * This interface declares the methods required by any TuitDaos
 * type classes.
 * All the methods must return a Promise which allows the
 * program to keep going while waiting for a response
 * from database.
 */
export default interface TuitDaoInterface {
    /**
     * Returns an array of Tuits. This is represents
     * all Tuits in the database
     */
    findAllTuits(): Promise<Tuit[]>;

    /**
     * Creates a tuit in the databasee. This will return the new Tuit
     * @param tuitIn {Tuit} The tuit you want to add to the database
     */
    createTuit(tuitIn: Tuit): Promise<Tuit>;

    // /**
    //  * Updates a tuit in the database. This will return the updated Tuit
    //  * @param tuitId {string} the object id of the tuit you want to update
    //  * @param tuit {Tuit} the tuit that will replace the target tuit in the databsae
    //  */
    // updateTuit(tuitId: string, tuit : Tuit): Promise<number>;

    /**
     * This returns a count of Tuits deleted
     * @param tuitId {string} the object id of the Tuit you want to delete
     * from the database
     */
    deleteTuit(tuitId: string): Promise<number>;

    /**
     * This will return a Tuit with an object id that matches the param
     * @param id {string} the id of the tuit you want to get
     */
    findTuitById(id: string) : Promise<Tuit>;

    /**
     * This will return an array of all Tuits made by a specific user
     * @param userId {string} the id of the user whose Tuits you want to get
     */
    findTuitsByUser(userId: string): Promise<Tuit[]>;
}
