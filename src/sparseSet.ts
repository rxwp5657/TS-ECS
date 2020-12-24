import Hashable from "./hashable"

export const Empty = -1

export class SparseSet<Key extends Hashable, Value> {
    
    private dense : (Value | undefined)[]
    private sparse : number[]
    private inverseSparse: number[]

    constructor() {
        this.dense = []
        this.sparse = []
        this.inverseSparse = []
    }

    add(key: Key, value: Value) : void {
        this.sparse[key.hash] = this.dense.length
        this.inverseSparse.push(key.hash)
        this.dense.push(value)
    }

    getValue(key: Key) : Value | undefined {
        return this.dense[this.sparse[key.hash]]
    }

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

    getValues() : (Value | undefined)[] {
        return this.dense;
    }

    length(): number {
        return this.dense.length
    }
}