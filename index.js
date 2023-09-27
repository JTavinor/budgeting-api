import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { BudgetGroup } from "./mongoose.js";

// Load environment variables from .env file
dotenv.config();

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Expense {
    name: String
    value: Float
    group: String
    subgroup: BudgetGroup
    timestamp: String
  }

  type BudgetGroup {
    _id: ID
    name: String
    subgroups: [BudgetGroup]
  }

  type User {
    _id: ID
    username: String
    password: String
    expenses: [Expense]
    budgetGroups: [BudgetGroup]
  }

  type Query {
    groups: [BudgetGroup]
  }

  type Mutation {
    createGroup(groupName: String!): BudgetGroup
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    groups: async () => {
      try {
        // Use Mongoose to fetch all budget groups from the database
        const groups = await BudgetGroup.find().exec();
        console.log("groups :>> ", groups);
        return groups;
      } catch (error) {
        console.error("Error fetching groups:", error);
        throw error; // You can handle the error as needed
      }
    },
  },
  Mutation: {
    createGroup: async (_, { groupName }) => {
      try {
        // console.log("groupName :>> ", groupName);
        // Create a new BudgetGroup instance
        const newGroup = new BudgetGroup({ name: groupName, subgroups: [] });

        // console.log("newGroup :>> ", newGroup);

        // Save the new group to the database
        const savedGroup = await newGroup.save();

        // console.log("savedGroup :>> ", savedGroup);

        return savedGroup;
      } catch (error) {
        console.error("Error creating group:", error);
        throw error; // You can handle the error as needed
      }
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4005 },
});

console.log(`🚀  Server ready at: ${url}`);
