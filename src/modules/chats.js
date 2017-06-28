import { uniqBy, sortBy } from "lodash";
import { mutateAsync } from "redux-query";
import { createAction, handleActions } from "redux-actions";
import ipsum from "lorem-ipsum";

export const actions = {
  openGuestChat: createAction("OPEN_GUEST_CHAT", id => ({ id })),
  openWorkerChat: createAction("OPEN_WORKER_CHAT", (id, type) => ({
    id,
    type
  })),
  closeWorkerChat: createAction("CLOSE_WORKER_CHAT", id => ({
    id
  })),
  endCall: createAction("END_WORKER_CALL"),
  sendMessage: (type, fromId, toId, message) =>
    mutateAsync(queries.sendMessageQuery(type, fromId, toId, message))
};

let chatMessageId = 0;

const fakeData = (fromId, toId, limit) =>
  Array.from(Array(limit).keys()).map(() => {
    const from = Math.random() >= 0.5;

    return {
      from: from ? fromId : toId,
      to: from ? toId : fromId,
      date: new Date(),
      id: chatMessageId++,
      message: ipsum()
    };
  });

export const queries = {
  getChatQuery: (type, fromId, toId, skip, limit) => ({
    url: `/api/chat/${type}/${toId}`,
    transform: data => ({
      chats: data
    }),
    update: {
      chats: (prev, next) => ({
        ...(prev || {}),
        [type]: {
          ...((prev || {})[type] || {}),
          [toId]: sortBy(
            [...next, ...(((prev || {})[type] || {})[toId] || [])],
            ({ id }) => id
          )
        }
      })
    },
    options: {
      headers: {
        fakeResponse: fakeData(fromId, toId, limit)
      }
    }
  }),
  sendMessageQuery: (type, fromId, toId, message) => ({
    url: `/api/chat/${type}/${toId}`,
    queryKey: `/api/chat/${type}/${toId}/send/message`,
    transform: data => ({ chats: [data] }),
    update: {
      chats: (prev, next) => ({
        ...(prev || {}),
        [type]: {
          ...((prev || {})[type] || {}),
          [toId]: sortBy(
            [...next, ...(((prev || {})[type] || {})[toId] || [])],
            ({ id }) => id
          )
        }
      })
    },
    options: {
      headers: {
        fakeResponse: {
          from: fromId,
          to: toId,
          date: new Date(),
          id: chatMessageId++,
          message
        }
      }
    }
  })
};

export const selectors = {
  getGuest: state =>
    state.chats.guest
      ? state.entities.guestOrdersById[state.chats.guest]
      : null,
  getWorker: state =>
    state.chats.worker
      ? {
          ...state.entities.workersById[state.chats.worker.id],
          type: state.chats.worker.type
        }
      : null,
  getWorkers: state =>
    state.chats.workers.map(({ id, type }) => ({
      ...state.entities.workersById[id],
      type
    })),
  getMessages: (state, type, toId) =>
    ((state.entities.chats || {})[type] || {})[toId] || []
};

export const reducer = handleActions(
  {
    [actions.openGuestChat]: (state, { payload: { id } }) => ({
      ...state,
      guest: id
    }),
    [actions.openWorkerChat]: (state, { payload: { id, type } }) =>
      state.worker && state.worker.type === "call"
        ? state
        : {
            ...state,
            worker: { id, type },
            workers: type === "call"
              ? state.workers
              : uniqBy(
                  [...state.workers, { id, type }],
                  ({ id, type }) => `${id}.${type}`
                )
          },
    [actions.endCall]: state =>
      state.worker && state.worker.type === "call"
        ? {
            ...state,
            worker: state.workers.length > 0
              ? state.workers[state.workers.length - 1]
              : null
          }
        : state,
    [actions.closeWorkerChat]: (state, { payload: { id, type } }) => {
      const workers = state.workers.filter(
        worker => !(worker.id === id && worker.type === type)
      );

      const worker = workers.length === 0 ? null : workers[workers.length - 1];

      return {
        ...state,
        workers,
        worker
      };
    }
  },
  {
    guest: null,
    worker: null,
    workers: []
  }
);
