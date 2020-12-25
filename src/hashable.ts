/**
 * Interface that ensures that any type
 * that implements it can be used as key
 * of a SparseSet. 
 */
export default interface Hashable {
    readonly hash: number
}