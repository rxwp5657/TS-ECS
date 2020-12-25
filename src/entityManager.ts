import { cloneDeep } from "lodash"
import { SparseSet } from "./sparseSet"
import Entity from "./entity"

interface ComponentManager {
    [index: string] : SparseSet<Entity, any>
}


export default class EntityManager {

    private entityID : number
    private entities : Entity[]
    private componentManagers: ComponentManager

    constructor() {
        this.entityID = 0
        this.entities = []
        this.componentManagers = {}
    }

    private getComponentManaget<T>(comp: { new(...params : any): T }): SparseSet<Entity, any> {
        return this.componentManagers[comp.name]
    }

    createEntity() : Entity {
        this.entities.push(new Entity(this.entityID))
        this.entityID++
        return this.entities[this.entities.length - 1]
    }

    addComponent<T>(entity: Entity, comp: object) : void {

        let comManager = this.componentManagers[comp.constructor.name]

        if(!comManager){
            comManager = new SparseSet<Entity, T>()
            this.componentManagers[comp.constructor.name] = comManager
        }

        comManager.add(entity, cloneDeep(comp))
    }

    getComponent<T>(entity: Entity, comp: { new(...params : any): T }) : T | undefined {
        let comManager = this.getComponentManaget(comp)
        return comManager ? comManager.getValue(entity) : undefined
    }

    getAllComponentsOfType<T>(comp: { new(...params : any): T }) : T[] {
        let comManager = this.getComponentManaget(comp)
        return comManager ? comManager.getValues() : []
    }

    getAllEntitiesWithType<T>(comp: { new(...params : any): T }): Entity[] {
        let comManager = this.getComponentManaget(comp)
        return comManager ? this.entities.filter(entity => comManager.getValue(entity)) : []
    }

    deleteComponent<T>(entity: Entity, comp: { new(...params : any): T } ): T | undefined {
        let comManager = this.getComponentManaget(comp)
        return comManager ? comManager.deleteValue(entity) : undefined
    }

    killEntity(entity: Entity): void {

        for(let comManager of Object.values(this.componentManagers)){
            if(comManager.getValue(entity)){
                comManager.deleteValue(entity)
            }
        }

        this.entities = this.entities.filter(currentEntity => entity.hash === currentEntity.hash)
    }
}