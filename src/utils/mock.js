import { faker } from "@faker-js/faker";
import { createHash } from "./hash.js";

faker.locale = "es";

const generateUser = async () => {
    
    const random = Math.random()*10
    const role = random <= 5 ? 'user' :'admin' 
    
    return {
        first_name: faker.person.firstName(),
        last_name:  faker.person.lastName(),
        age:    Math.round(random*10),
        email: faker.internet.email(),
        password: await createHash('coder123'),
        role: role, 
        pets: [],
        //cart:[],
        //_id: uuidv4(), 
    };
};


export const createUsersMock = async (cant = 20) => {
    try {
        const usersArray = [];
        for (let i = 0; i < cant; i++) {
            const user = await generateUser();
            usersArray.push(user);
        }
        return usersArray;
    } catch (error) {
        throw new Error(error);
    }
}


export const createPetsMock = (cant=0)=>{
    let petsArray=[]

    for (let i = 0; i < cant; i++) {
        const pet = {
            name: faker.person.firstName(),
            type: faker.animal.type(),
            owner: null,
            adopted:false,
            //_id: uuidv4()
        }

        petsArray.push(pet);
    }
    return petsArray;

}