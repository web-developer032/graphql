const { GraphQLID, GraphQLString, GraphQLObjectType } = require("graphql");
const { projects } = require("../../data/sampleData");
const ProjectType = require("./projectTypeSchema");

const ClientType = new GraphQLObjectType({
    name: "Client",
    fields: () => ({
        id: {
            type: GraphQLID,
        },
        name: {
            type: GraphQLString,
        },
        email: {
            type: GraphQLString,
        },
        phone: {
            type: GraphQLString,
        },

        project: {
            type: ProjectType,
            resolve(client, args) {
                return projects.find((project) => project.clientId === client.id);
            },
        },
    }),
});

module.exports = ClientType;
