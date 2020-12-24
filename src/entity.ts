import Hashable from "./hashable"

export default class Entity implements Hashable {

    readonly hash: number

    constructor(id : number) {
        this.hash = id
    }
}