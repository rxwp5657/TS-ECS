import Hashable from "./hashable"

export const Empty = -1

/**
 * An associative data structure that aims to tightly pack 
 * related objects of type T to take advantage of Cache 
 * (Data oriented design).
 * Insert, lookup and delete operations are O(1)
 * 
 * @typeParam Key a type that implements Hashable interface
 * so it can be used as key.
 * @typeParam Value any type we want to store. 
 */
export class SparseSet<Key extends Hashable, Value> {
    
    private dense : (Value | undefined)[]
    private sparse : number[]
    private inverseSparse: number[]

    constructor() {
        this.dense = []
        this.sparse = []
        this.inverseSparse = []
    }

    /**
     * Create a new association between a Hashable key and
     * any Value. 
     */
    add(key: Key, value: Value) : void {
        this.sparse[key.hash] = this.dense.length
        this.inverseSparse.push(key.hash)
        this.dense.push(value)
    }

    /**
     * Get the associated Value of the specified key,
     * it returns undefined if no Value is associated.
     */
    getValue(key: Key) : Value | undefined {
        return this.dense[this.sparse[key.hash]]
    }

    /**
     * Delete the association between the specified key and
     * its corresponding Value if any.
     * 
     * @returns undefined if no association was found or the 
     * Value of the association otherwise.
     */
    deleteValue(key: Key) : Value | undefined {

        if(this.sparse[key.hash] === Empty ||
           this.sparse[key.hash] === undefined){
            return undefined
        }

        let denseIndex = this.sparse[key.hash]
        let keyOfLastValue = this.inverseSparse.pop() || 0

        let result = this.dense[denseIndex]

        this.dense[denseIndex] = this.dense.pop()
        this.sparse[keyOfLastValue] = denseIndex
        this.inverseSparse[denseIndex] = keyOfLastValue

        if(this.inverseSparse[this.inverseSparse.length - 1] === key.hash){
            this.dense.pop()
            this.inverseSparse.pop()
        }

        this.sparse[key.hash] = Empty

        return result
    }

    /**
     * Get a tightly packed array of the specified Values.
     */
    getValues() : (Value | undefined)[] {
        return this.dense;
    }

    /**
     * Get how many elements are stored in the SparseSet.
     */
    length(): number {
        return this.dense.length
    }
}