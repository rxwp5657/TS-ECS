import { cloneDeep } from "lodash"
import { SparseSet } from "./sparseSet"
import Entity from "./entity"

/**
 * Define an object whose key
 * is the type to be stored 
 * by the SparseSet and the value
 * is the actual SparseSet.
 */
interface ComponentManager {
    [index: string] : SparseSet<Entity, any>
}

/**
 * This class is in charge of creating new entities 
 * and relations between components.
 */
export default class EntityManager {

    private entityID : number
    private entities : Entity[]
    private componentManagers: ComponentManager

    constructor() {
        this.entityID = 0
        this.entities = []
        this.componentManagers = {}
    }

    /**
     * Get the corresponding SparseSet that manages values of type T.
     * 
     * @param comp type whose SparseSet we want to retrieve (e.g. Point)
     * @returns the SparseSet that manages values of type T
     */
    private getComponentManaget<T>(comp: { new(...params : any): T }): SparseSet<Entity, any> {
        return this.componentManagers[comp.name]
    }

    /**
     * Create a new entity with a unique id.
     * 
     * @returns a newly created entity, all entities
     * returned by this function have different ids.
     */
    createEntity() : Entity {
        this.entities.push(new Entity(this.entityID))
        this.entityID++
        return this.entities[this.entities.length - 1]
    }

    /**
     * Associate a component of type T to the specified entity.
     * 
     * @param entity the entity that will own the specified component.
     * @param comp the component to attach which must be a class.
     */
    addComponent<T>(entity: Entity, comp: object) : void {

        let comManager = this.componentManagers[comp.constructor.name]

        if(!comManager){
            comManager = new SparseSet<Entity, T>()
            this.componentManagers[comp.constructor.name] = comManager
        }

        comManager.add(entity, cloneDeep(comp))
    }

    /**
     * Get the component of type T associated with the specified entity,
     * if no component is associated to it then it returns undefined.
     * 
     * 
     * @param entity the entity that we want to retrieve its component.
     * @param comp the type of the component we want to retrieve (e.g. Point).
     * @returns the component of type T associated with the entity if any, undefined
     *          if there isn't one. 
     */
    getComponent<T>(entity: Entity, comp: { new(...params : any): T }) : T | undefined {
        let comManager = this.getComponentManaget(comp)
        return comManager ? comManager.getValue(entity) : undefined
    }

    /**
     * Returns a list of components of type T.
     * 
     * @param comp the type whose dense array whe want to retrieve.
     * @returns the array of components of type T.
     */
    getAllComponentsOfType<T>(comp: { new(...params : any): T }) : T[] {
        let comManager = this.getComponentManaget(comp)
        return comManager ? comManager.getValues() : []
    }

    /**
     * Returns a list of all the entities that have a component of type
     * T associated to it.
     * 
     * @param comp the type that we expect the entities to have.
     * @returns the list of entities that have associated a component of type T.
     */
    getAllEntitiesWithType<T>(comp: { new(...params : any): T }): Entity[] {
        let comManager = this.getComponentManaget(comp)
        return comManager ? this.entities.filter(entity => comManager.getValue(entity)) : []
    }

    /**
     * Deletes the component of type T associated to the specified entity,
     * if the entity doesn't have one associated it returns undefined.
     * 
     * @param entity the entity whose component of type T we want to delete.
     * @param comp the type of the component to delete.
     * @returns the deleted component if any.
     */
    deleteComponent<T>(entity: Entity, comp: { new(...params : any): T } ): T | undefined {
        let comManager = this.getComponentManaget(comp)
        return comManager ? comManager.deleteValue(entity) : undefined
    }

    /**
     * Deletes all the components associated with the specified entity and
     * remove it from the entity array.
     * 
     * @param entity the entity to kill.
     */
    killEntity(entity: Entity): void {

        for(let comManager of Object.values(this.componentManagers)){
            if(comManager.getValue(entity)){
                comManager.deleteValue(entity)
            }
        }

        this.entities = this.entities.filter(currentEntity => entity.hash === currentEntity.hash)
    }
}