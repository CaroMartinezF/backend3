import {describe, test, before} from 'node:test'
import assert from 'node:assert'
import { generateUserTest } from '../../utils/mock.js'


const usersURL = 'http://localhost:8080/api/users'
const authURL = 'http://localhost:8080/api/session'

let newUser={}
let newUserId=0
let cookieToken = null

//Tests de Endpoints de User
describe ("Tests API Users", ()=>{

    //Nuevo Usuario
    before(async()=>{
        newUser = await generateUserTest();
    })


    // Get Users
    test("[GET] /api/users", async ()=>{
        const response = await fetch(usersURL);
        const responseJSON = await response.json()
        
        assert.strictEqual(Array.isArray(responseJSON), true)
    })

    // Registro User
    test("[POST] /api/session/register", async ()=>{
        const response = await fetch(`${authURL}/register`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        });
        const responseJSON = await response.json()
        
        assert.ok(responseJSON._id)
        assert.equal(responseJSON.email, newUser.email)

        newUserId= responseJSON._id

        console.log("/////register////", responseJSON);
        
    })

    //Get User por Id
    test("[GET] /api/users/:uid", async ()=>{
        const response = await fetch(`${usersURL}/${newUserId}`);
        const responseJSON = await response.json()
        
        assert.equal(responseJSON._id, newUserId)
    })

    // Login
    test("[POST] /api/session/login", async ()=>{

        const credenciales ={
            email: newUser.email,
            password: 'coder123'
        }

        const response = await fetch(`${authURL}/login`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credenciales),
            credentials: 'include'
        });
        const responseJSON = await response.json()
        
        console.log("///////////////", responseJSON);
        assert.ok(responseJSON.token)
        assert.equal(responseJSON.message, 'Sesión iniciada')


        const setCookieHeader = response.headers.get('set-cookie')
        assert.ok(setCookieHeader)
        assert.ok(setCookieHeader.includes('token'))

        cookieToken = setCookieHeader.split(';')[0]

        
    })

    // Current
    test("[GET] /api/session/current", async ()=>{
        const response = await fetch(`${authURL}/current`,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieToken
            },
            credentials: 'include'
        });
        const responseJSON = await response.json()

        assert.equal(responseJSON.user.email, newUser.email)
        assert.equal(responseJSON.message, 'Bienvenido')
    })


    //Logout
    test("[GET] /api/session/logout", async ()=>{
        
        
        const response = await fetch(`${authURL}/logout`,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieToken
            },
            credentials: 'include'
        });
        const responseJSON = await response.json()
        assert.equal(responseJSON.message, "Sesión cerrada")
    })
}) 

