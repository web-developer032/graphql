const express = require("express");
const expressGraphQL = require("express-graphql");
const { graphqlHTTP, getGraphQLParams } = expressGraphQL;

// const data = require("./data/sampleData");

// GRAPHQL SCHEMA
const graphqlSchema = require("./schemas/graphql/schema");
const errorController = require("./controllers/errorController");

const app = express();

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphqlSchema,
        graphiql: process.env.NODE_ENV === "development",
    })
);

app.use(errorController);

module.exports = app;
