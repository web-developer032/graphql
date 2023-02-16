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

const Project = require("../mongo/ProjectSchema");
const Client = require("../mongo/ClientSchema");

// const ClientType = require("./clientTypeSchema");
// const ProjectType = require("./projectTypeSchema");

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
                // return projects.find((project) => project.clientId === client.id);
                return Project.find({ clientId: client.id });
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
                // return clients.find((client) => client.id === project.clientId);
                return Client.findById(project.clientId);
            },
        },
    }),
});

// MUTATIONS
const mutation = new GraphQLObjectType({
    name: "ClientMutation",
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                const client = await Client.create({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return client.save();
            },
        },
    },
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
                // return clients.find((client) => client.id === args.id);
                return Client.findById(args.id);
            },
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                // return clients;
                return Client.find({});
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
                // return projects.find((project) => project.id === args.id);
                return Project.findById(args.id);
            },
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                // return projects;
                return Project.find({});
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
});
