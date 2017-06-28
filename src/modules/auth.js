import { mutateAsync } from "redux-query";

export const actions = {
  signIn: (email, password, rememberMe = false) =>
    mutateAsync(queries.signInQuery(email, password, rememberMe)),
  signUp: (email, password) => mutateAsync(queries.signUpQuery(email, password))
};

export const queries = {
  signInQuery: (email, password, remmeberMe = false) => ({
    url: "/api/singin",
    transform: data => ({
      auth: data
    }),
    update: {
      auth: (prev, next) => next
    },
    options: {
      headers: {
        fakeResponse: {
          id: -1,
          name: email,
          email
        }
      }
    }
  }),
  signUpQuery: (email, password) => ({
    url: "/api/signup",
    transform: data => ({
      auth: data
    }),
    update: {
      auth: (prev, next) => next
    },
    options: {
      headers: {
        fakeResponse: {
          id: -1,
          name: email,
          email
        }
      }
    }
  })
};
