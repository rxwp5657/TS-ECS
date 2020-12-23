import { SparseSet } from "../src/sparseSet"
import Entity from "../src/entity"


describe("Sparse Set testing", () => {

    test(`it should only use classes that implement 
          the Hashable interface as sparse-set key`, () => {
        
        const testConstructor = jest.fn(() => new SparseSet<Entity, number>())

        testConstructor()
        expect(testConstructor).toHaveReturned()
    })

    test("it should associate an element E with key K", () => {

        let sparseSet = new SparseSet<Entity, number>()

        sparseSet.add(new Entity(0), 100)
        sparseSet.add(new Entity(1), 200)

        expect(sparseSet.length()).toBe(2)
    })

    test("it should retrieve the element associated to a key K", () => {

        let sparseSet = new SparseSet<Entity, number>()

        let e0 = new Entity(0)
        let e1 = new Entity(1)
        let e2 = new Entity(2)

        let e0Value = 100
        let e1Value = 200

        sparseSet.add(e0, e0Value)
        sparseSet.add(e1, e1Value)

        expect(sparseSet.getValue(e0)).toBe(e0Value)
        expect(sparseSet.getValue(e1)).toBe(e1Value)
        expect(sparseSet.getValue(e2)).toBeUndefined()
    })

    test("it should delete an element E associated to a key K", () => {

        let sparseSet = new SparseSet<Entity, number>()

        let e0 = new Entity(0)
        let e1 = new Entity(1)
        let e2 = new Entity(2)

        let e0Value = 100
        let e1Value = 200

        sparseSet.add(e0, 100)
        sparseSet.add(e1, 200)

        expect(sparseSet.deleteValue(e0)).toBe(e0Value)
        expect(sparseSet.deleteValue(e1)).toBe(e1Value)

        expect(sparseSet.deleteValue(e2)).toBeUndefined()

        expect(sparseSet.getValue(e0)).toBeUndefined()
        expect(sparseSet.getValue(e1)).toBeUndefined()
    })

    test("it should retrieve all elements stored on the sparse-set", () => {

        let sparseSet = new SparseSet<Entity, number>()

        let e0 = new Entity(1)
        let e1 = new Entity(2)

        let expecteds = [100, 200]

        sparseSet.add(e0, expecteds[0])
        sparseSet.add(e1, expecteds[1])

        let dense = sparseSet.getValues()

        for(let i = 0; i < expecteds.length; i++){
            expect(dense[0]).toBe(expecteds[0])
        }
    })
})