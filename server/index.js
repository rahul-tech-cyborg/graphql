const express = require("express")
const {ApolloServer} = require("@apollo/server")
const bodyParser  = require('body-parser')
const {expressMiddleware} = require("@apollo/server/express4")
const cors = require("cors")
const axios = require("axios")

async function startServer(){
    const app = express();
    const server = new ApolloServer({
        typeDefs:`
            type User {
                id : ID!,
                name : String,
                username : String,
                email : String,
                phone : String,
                website : String
            }
            type Todo {
                id : ID!,
                title : String!,
                completed : Boolean,
                userId : ID!,
                user : User
            }
            type Query {
                getTodos : [Todo]
                getUser(id:ID!) : User
            }
        `,
        resolvers:{
            Todo : {
                user : async(todo)=>{
                    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)
                    return response.data;
                }
            },
            Query:{
                getTodos : async ()=>{
                    const response = await axios.get("https://jsonplaceholder.typicode.com/todos")
                    return response.data.slice(0,5);
                },
                getUser : async (parent,{id}) =>{
                    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
                    return response.data;
                }
            }
        }
    });
    app.use(bodyParser.json());
    app.use(cors());
    await server.start();
    app.use('/graphql',expressMiddleware(server));
    app.listen(8000,()=>{
        console.log("Server started at port 8000")
    })
}

startServer()

/*
query GetAllTodos{
  getTodos{
    title
    id
  }
  getUser(id:5){
    id
    name
  }
}


{
  "data": {
    "getTodos": [
      {
        "title": "delectus aut autem"
      },
      {
        "title": "quis ut nam facilis et officia qui"
      },
      {
        "title": "fugiat veniam minus"
      },
      {
        "title": "et porro tempora"
      },
      {
        "title": "laboriosam mollitia et enim quasi adipisci quia provident illum"
      }
    ],
    "getUser": {
      "id": "5",
      "name": "Chelsey Dietrich"
    }
  }
}



query GetAllTodos{
  getTodos{
    title
    user{
      name
      email
      phone
    }
  }
}

{
  "data": {
    "getTodos": [
      {
        "title": "delectus aut autem",
        "user": {
          "name": "Leanne Graham",
          "email": "Sincere@april.biz",
          "phone": "1-770-736-8031 x56442"
        }
      },
      {
        "title": "quis ut nam facilis et officia qui",
        "user": {
          "name": "Leanne Graham",
          "email": "Sincere@april.biz",
          "phone": "1-770-736-8031 x56442"
        }
      },
      {
        "title": "fugiat veniam minus",
        "user": {
          "name": "Leanne Graham",
          "email": "Sincere@april.biz",
          "phone": "1-770-736-8031 x56442"
        }
      },
      {
        "title": "et porro tempora",
        "user": {
          "name": "Leanne Graham",
          "email": "Sincere@april.biz",
          "phone": "1-770-736-8031 x56442"
        }
      },
      {
        "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
        "user": {
          "name": "Leanne Graham",
          "email": "Sincere@april.biz",
          "phone": "1-770-736-8031 x56442"
        }
      }
    ]
  }
}
*/