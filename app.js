const express = require('express');

const { graphqlHTTP } = require('express-graphql');

// const { conn } = require('./db/connect');

const bodyParser = require('body-parser');
require('./db/connect');

// const { default: mongoose } = require('mongoose');
const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphQlSchema,
        // resolver
        rootValue: graphQlResolvers,
        graphiql: true,
    })
);

app.listen(PORT, () => {
    console.log(`app listening to port ${PORT}`);
});
