import {describe, test, before} from 'node:test'
import assert from 'node:assert'
import { generateUserTest } from '../../utils/mock.js'


const cartsURL = 'http://localhost:8080/api/carts'
const productsURL = 'http://localhost:8080/api/products'
const authURL = 'http://localhost:8080/api/session'

let newCartid = 0
let newUser={}
let newProduct={
    title:          "Buzo",
    description:    "Amarillo",
    code:           "1234",
    price:          12000,
    stock:          5,
    category:       "Ropa",
    status:         true
}
let newProductId=0
let cookieToken = null

//Tests

describe ("Tests API Cart", ()=>{

    //Logueo como User
    before( async ()=>{

        //Registro:
        newUser = await generateUserTest()
        newUser.role = "admin"

        const responseNewUserAddProd = await fetch(`${authURL}/register`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        });

        //Logueo:
        const credencialesAddProd ={
            email: newUser.email,
            password: 'coder123'
        }
        const responseLoginAddProd = await fetch(`${authURL}/login`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credencialesAddProd),
            credentials: 'include'
        });

        const setCookieHeaderAddProd = responseLoginAddProd.headers.get('set-cookie')
        cookieToken = setCookieHeaderAddProd.split(';')[0]

        //Nuevo Producto
        const responseGenerarProd = await fetch(productsURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieToken
            },
            body: JSON.stringify(newProduct)
        });

        const responseGenerarProdJSON = await responseGenerarProd.json()

        newProductId= responseGenerarProdJSON._id

        // Registro User
        newUser = await generateUserTest()
        newUser.role = "user"

        const responseNewUser = await fetch(`${authURL}/register`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        });

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

        const setCookieHeader = responseLogin.headers.get('set-cookie')
        cookieToken = setCookieHeader.split(';')[0]
        
    })

    //Nuevo Cart
    test("[POST] /api/carts", async ()=>{
        const response = await fetch(cartsURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieToken
            },
            
        });
        const responseJSON = await response.json()
        
        console.log("CART:",responseJSON);
        
        assert.ok(responseJSON.cart._id, true)
        assert.strictEqual(Array.isArray(responseJSON.cart.products), true)
        
        newCartid= responseJSON.cart._id
        console.log("NewCartID: ",newCartid);
    })

    //Agregar Product a Cart
    test("[POST] /api/carts/:cid/products/:pid", async ()=>{
        const response = await fetch(`${cartsURL}/${newCartid}/products/${newProductId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieToken
            },
            
        });
        const responseJSON = await response.json()
        
        assert.equal(responseJSON.products.length, 1)
        assert.equal(responseJSON.products[0].product, newProductId)
        assert.equal(responseJSON.products[0].quantity, 1)
    })

    // Cart Purchase
    test("[GET] /api/carts/:cid/purchase", async ()=>{
        const response = await fetch(`${cartsURL}/${newCartid}/purchase`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieToken
            },
            
        });
        const responseJSON = await response.json()

        assert.ok(responseJSON.ticket)
        assert.ok(responseJSON.ticketProducts)
        assert.ok(responseJSON.productOutOfStock)
        assert.ok(responseJSON.ticket.code)
        assert.ok(responseJSON.ticket.purchaser, newUser.email)
        assert.equal(Array.isArray(responseJSON.ticketProducts),true)
        assert.equal(Array.isArray(responseJSON.productOutOfStock), true)
    })
}) 

