const { GraphQLID, GraphQLString, GraphQLObjectType } = require("graphql");
const { clients } = require("../../data/sampleData");
const ClientType = require("./clientTypeSchema");

const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: {
            type: GraphQLID,
        },
        clientId: {
            type: GraphQLString,
        },
        name: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
        status: {
            type: GraphQLString,
        },

        client: {
            type: ClientType,
            resolve(project, args) {
                return clients.find((client) => client.id === project.clientId);
            },
        },
    }),
});

module.exports = ProjectType;
