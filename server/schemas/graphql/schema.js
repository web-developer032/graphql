const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLSchema,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,
} = require("graphql");

// const { clients, projects } = require("../../data/sampleData");

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
            type: new GraphQLList(ProjectType),
            async resolve(client, args) {
                // return projects.find((project) => project.clientId === client.id);
                const data = await Project.find({ clientId: client.id });
                return data;
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
            async resolve(project, args) {
                // return clients.find((client) => client.id === project.clientId);
                return await Client.findById(project.clientId);
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
                const client = await Project.create({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return client;
            },
        },

        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                const client = await Client.findByIdAndDelete(args.id);
                const project = await Project.deleteMany({ clientId: args.id });
                return { client, project };
            },
        },

        addProject: {
            type: ProjectType,

            args: {
                clientId: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            new: { value: "pending" },
                            progress: { value: "progress" },
                            queue: { value: "queue" },
                            completed: { value: "completed" },
                        },
                    }),
                    defaultValue: "pending",
                },
            },
            async resolve(parent, args) {
                const project = await Project.create({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });
                return project;
            },
        },

        updateProject: {
            type: ProjectType,

            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: "UpdateProjectStatus",
                        values: {
                            new: { value: "pending" },
                            progress: { value: "progress" },
                            queue: { value: "queue" },
                            completed: { value: "completed" },
                        },
                    }),
                },
            },
            async resolve(parent, args) {
                const project = await Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status,
                        },
                    },
                    { new: true } // THIS MEANS RETURN UPDATED OBJECT
                );
                return project;
            },
        },

        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                const project = await Project.findByIdAndDelete(args.id);
                return project;
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
    mutation,
});
