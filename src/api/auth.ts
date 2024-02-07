


export type User ={

    id: number,
    username: string,
    name: string,
    lastName:string,
    email:string
    userType:string

}

export type LogInCredentials ={

    email:string,
    password:string

}

let demoUser: User | null = null

const defaultUser: User = {

    id:12,
    email:"test@Test.com",
    name:"John",
    lastName:"Doe",
    username:"test",
    userType:"ADMIN"

}

let yes =false

export const getMe= async ()=>{

        // console.log("Fetching me query")
    await fetch("https://swapi.dev/api/people/1")
    // console.log("response get me")

    return yes? defaultUser : demoUser 
}


export const logIn = async (credentilas: LogInCredentials)=>{
    await fetch("https://swapi.dev/api/people/1")
    // console.log("response log in")
    yes = true
    return defaultUser
}

export const logOut = async ()=>{
    await fetch("https://swapi.dev/api/people/1")
    console.log("response log out")
    yes = false
    return demoUser
}