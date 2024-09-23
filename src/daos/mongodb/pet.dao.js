import { petModel } from "./models/petModel.js"


class PetManager{
    
    

    //Metodo Obtener pets
    async getPets(){
        return await petModel.find({})
    }

    //Metodo Agregar pet
    async addPet(pet){
        
        return  await petModel.create(pet)
    }

    //Metodo Agregar pets
    async createPets(pets){
        
        return  await petModel.insertMany(pets)
    }
}



export const PetDaoMongoDB = new PetManager()