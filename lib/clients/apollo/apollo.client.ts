import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "http://localhost:4350/graphql",
  cache: new InMemoryCache(),
});
