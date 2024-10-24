import {describe, test, before} from 'node:test'
import assert from 'node:assert'
import { generateUserTest } from '../../utils/mock.js'

const productsURL = 'http://localhost:8080/api/products'
const authURL = 'http://localhost:8080/api/session'

let newUser={}
let newProduct={
    title:          "Remera",
    description:    "Azul",
    code:           "58",
    price:          6000,
    stock:          12,
    category:       "Ropa",
    status:         true
}
let newProductId=0
let cookieToken = null

// Tests 

describe ("Tests API Product", ()=>{
    // Get Products
    test("[GET] /api/products", async ()=>{
        const response = await fetch(productsURL);
        const responseJSON = await response.json()

        assert.strictEqual(Array.isArray(responseJSON.paylaod), true)
    })

    //Agregar Product
    test("[POST] /api/products", async ()=>{

        //Registro:
        newUser = await generateUserTest()
        newUser.role = "admin"

        const responseNewUser = await fetch(`${authURL}/register`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        });
        const responseNewUserJSON = await responseNewUser.json()
        assert.ok(responseNewUserJSON._id)

        //Logueo:
        const credenciales ={
            email: newUser.email,
            password: 'coder123'
        }
        const responseLogin = await fetch(`${authURL}/login`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credenciales),
            credentials: 'include'
        });

        const responseLoginJSON = await responseLogin.json()
        assert.ok(responseLoginJSON.token)

        const setCookieHeader = responseLogin.headers.get('set-cookie')
        cookieToken = setCookieHeader.split(';')[0]

        //Nuevo Producto


        const response = await fetch(productsURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieToken
            },
            body: JSON.stringify(newProduct)
        });


        const responseJSON = await response.json()

        assert.ok(responseJSON._id)
        
        newProductId= responseJSON._id
    })

    //Product por ID
    test("[POST] /api/products/:pid", async ()=>{

        const response = await fetch(`${productsURL}/${newProductId}`);

        const responseJSON = await response.json()

        
        assert.equal(responseJSON._id, newProductId)
        
    })

    // Actualizar Product por ID
    test("[PUT] /api/products/:pid", async ()=>{
        const response = await fetch(`${productsURL}/${newProductId}`);
        const responseJSON = await response.json()
        assert.equal(responseJSON.price, 6000)

        //Update
        const responseUpdate = await fetch(`${productsURL}/${newProductId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieToken
            },
            body: JSON.stringify({price:5000})
        });

        const responseUpdateJSON = await responseUpdate.json()
        console.log("responseJSON REGISTER", responseUpdateJSON);
        assert.equal(responseUpdateJSON.price, 5000)
        
    })
}) 

