const express= require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');
const app = express();

/*
Object types

ID
String
Int
Boolean
List - []
*/

let message = "this is a message";

const schema = buildSchema(`
    type Post {
        userId: Int
        id: Int
        title: String
        body: String
    }

    type User {
        name: String!
        age: Int!
        college: String
    }

    type Query {
        hello: String
        welcomeMessage(name: String, dayOfWeek: String): String
        getUser: User
        getUsers: [User]
        getPostsFromExtAPI: [Post]
        message: String
    }
    input UserInput {
        name: String!
        age: Int!
        college: String
    }

    type Mutation {
        setMessage(newMessage: String): String
        createUser(user: UserInput) : User 
    }


`)
// welcomeMessage(name: String, dayOfWeek: String!): String  // ! makes the field mandatory and throws error
// hello: String! // string returns cannot be nullable

//createUser(name: String!, age: Int!, college: String): User //ellaborative way

// Resolver
const root = {
    hello:() => {
        return "Hello World!";
    },
    welcomeMessage:(args) =>{
        console.log(args);
        return `Hey ${args.name},hows life, today is ${args.dayOfWeek}`;
    },
    getUser:() =>{
        const user = {
            name: "Swesh",
            age:34,
            college:"SASTRA",
        };
        return user;
    },
    getUsers:() =>{
        const users = [ 
        {
            name: "Swesh",
            age:34,
            college:"SASTRA",
        },
        {
            name: "John Doe",
            age:34,
            college:"AU",
        }
        ];
        return users;
    },
    getPostsFromExtAPI: async () =>{
        const result = await axios.get(
            'http://jsonplaceholder.typicode.com/posts'
        );
        return result.data
        // return axios
        // .get('http://jsonplaceholder.typicode.com/posts')
        // .then(result => result.data);
    },
    setMessage : ({newMessage}) =>{
        message = newMessage
        return message
    },
    message: () => message,
    // createUser:({name, age, college}) =>{
    //     return {name, age, college}
    // }
    createUser: args => {
        return args.user;
    }
}

app.use('/graphql',graphqlHTTP({
    graphiql:true,
    schema:schema,
    rootValue:root,
}))

app.listen(4000, ()=> {console.log(` Server on port 4000`)});

//http://localhost:4000/graphql