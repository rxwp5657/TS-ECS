import Hashable from "./hashable"

/**
 * An Entity is a general purpose object 
 * that is usually made up of one ID.
 * This id is used to bind together a 
 * bunch of components that contain 
 * actual raw data that can be processed 
 * by a system.
 */
export default class Entity implements Hashable {

    readonly hash: number

    constructor(id : number) {
        this.hash = id
    }
}