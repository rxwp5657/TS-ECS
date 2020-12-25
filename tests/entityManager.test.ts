import EntityManager from "../src/entityManager"


class Point {
    public x: number
    public y: number
    public z: number

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }
}


describe("EntityManager test sute", () => {

    test("it should create new entities", () => {
        let entityManager = new EntityManager()

        let e0 = entityManager.createEntity()
        let e1 = entityManager.createEntity()

        expect(e0.hash).toBe(0)
        expect(e1.hash).toBe(1)
    })

    test("it should retrieve a component asociated to a new entity", () => {
        let entityManager = new EntityManager()

        let e0 = entityManager.createEntity()
        let e1 = entityManager.createEntity()

        let point0 = new Point(1, 2, 3)
        let point1 = new Point(2, 3, 4)

        entityManager.addComponent(e0, point0)
        entityManager.addComponent(e1, point1)

        let p0 = entityManager.getComponent(e0, Point)
        let p1 = entityManager.getComponent(e1, Point)

        expect(p0 &&
               p0.x == point0.x &&
               p0.y == point0.y &&
               p0.z == point0.z ).toBeTruthy()

        expect(p1 &&
               p1.x == point1.x &&
               p1.y == point1.y &&
               p1.z == point1.z ).toBeTruthy()
    })

    test("it should retrieve all components of type T", () => {
        
        let entityManager = new EntityManager()

        let e0 = entityManager.createEntity()
        let e1 = entityManager.createEntity()

        let expectedPoints = [new Point(1, 2, 3), new Point(2, 3, 4)]

        entityManager.addComponent(e0, expectedPoints[0])
        entityManager.addComponent(e1, expectedPoints[1])

        let points = entityManager.getAllComponentsOfType(Point)

        for(let i = 0; i < points.length; i++) {
            expect(points[i].x == expectedPoints[i].x &&
                   points[i].y == expectedPoints[i].y &&
                   points[i].z == expectedPoints[i].z).toBeTruthy()
        }
    })

    test("it should retrieve all Entities that have a type T", () => {

        let entityManager = new EntityManager()

        let e0 = entityManager.createEntity()

        let point0 = new Point(1, 2, 3)

        entityManager.addComponent(e0, point0)

        let entities = entityManager.getAllEntitiesWithType(Point)

        expect(entities.length).toBe(1)
        expect(entities[0].hash).toBe(0)
    })

    test("it should delete a component of an entity", () => {

        let entityManager = new EntityManager()

        let e0 = entityManager.createEntity()

        let point0 = new Point(1, 2, 3)

        entityManager.addComponent(e0, point0)

        entityManager.deleteComponent(e0, Point)

        expect(entityManager.getComponent(e0, Point)).toBeUndefined()
    })

    test("it should delete an entity", () => {

        let entityManager = new EntityManager()

        let e0 = entityManager.createEntity()

        let point0 = new Point(1, 2, 3)

        entityManager.addComponent(e0, point0)

        entityManager.killEntity(e0)

        expect(entityManager.getComponent(e0, Point)).toBeUndefined()
        expect(entityManager.getAllEntitiesWithType(Point).length).toBe(0)
    })
})