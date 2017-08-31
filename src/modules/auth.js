import { mutateAsync } from "redux-query";
import randomAvatar from "random-avatar";
import { createAction, handleActions } from "redux-actions";

export const actions = {
  signIn: (email, password, rememberMe = false) =>
    mutateAsync(queries.signInMutation(email, password, rememberMe)),
  signUp: (email, password) =>
    mutateAsync(queries.signUpMutation(email, password)),
  saveProfile: profile => mutateAsync(queries.saveProfileMutation(profile)),
  saveProfileSettings: settings =>
    mutateAsync(queries.saveProfileSettingsMutation(settings)),
  signOut: createAction("SIGN_OUT", () => { }),
  authenticated: createAction("AUTHENTICATED", auth => (auth)),
};

export const selectors = {
  user: state => state.auth.user
};

const defaultData = {
  id: -1,
  avatar: randomAvatar(),
  settings: {
    soundNotification: true,
    desktopNotification: false,
    autoResponder: "schedule"
  }
};

export const queries = {
  signInMutation: (email, password, remmeberMe = false) => ({
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
          ...defaultData,
          name: email,
          email
        }
      }
    }
  }),
  signUpMutation: (email, password) => ({
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
          ...defaultData,
          name: email,
          email
        }
      }
    }
  }),
  signOutMutation: () => ({
    url: "/api/signout",
    transform: data => ({
      auth: null
    }),
    update: {
      auth: (prev, next) => next
    },
    options: { headers: { fakeResponse: {} } }
  }),
  saveProfileMutation: profile => ({
    url: "/api/profile",
    queryKey: "/api/profile/update",
    transform: data => ({
      auth: data
    }),
    update: {
      auth: (prev, next) => next
    },
    options: {
      headers: {
        fakeResponse: profile
      }
    }
  }),
  saveProfileSettingsMutation: settings => ({
    url: "/api/profile/settings",
    queryKey: "/api/profile/settings/update",
    transform: data => ({
      auth: { settings: data }
    }),
    update: {
      auth: (prev, next) => ({
        ...prev,
        settings: next.settings
      })
    },
    options: {
      headers: {
        fakeResponse: settings
      }
    }
  })
};

export const reducer = handleActions(
  {
    [actions.authenticated]: (state, { payload }) => ({
      ...state,
      user: payload
    }),
    [actions.signOut]: (state) => ({
      ...state,
      user: null
    }),
  },
  {
    user: null,
  }
);

