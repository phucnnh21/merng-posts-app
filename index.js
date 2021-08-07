const { ApolloServer } = require('apollo-server');
// const { PubSub } = require('graphql-subscriptions');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config');

// const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    cors: {
      origin: '*',
      credentials: true
    },
    resolvers,
    context: ({ req }) => ({ req })
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => console.log("DB Connected"));

server.listen(9000, () => console.log("Running!"));