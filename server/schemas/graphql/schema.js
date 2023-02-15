const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLSchema,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
} = require("graphql");

const { clients, projects } = require("../../data/sampleData");

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

const RootQueryType = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        client: {
            type: ClientType,
            args: {
                id: {
                    type: GraphQLID,
                },
            },
            resolve(parent, args) {
                return clients.find((client) => client.id === args.id);
            },
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return clients;
            },
        },

        project: {
            type: ProjectType,
            args: {
                id: {
                    type: GraphQLID,
                },
            },
            resolve(parent, args) {
                return projects.find((project) => project.id === args.id);
            },
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return projects;
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
});
