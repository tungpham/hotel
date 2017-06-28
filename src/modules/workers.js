import { normalize, schema } from "normalizr";
import { values } from "lodash";
import randomAvatar from "random-avatar";

const workerSchema = new schema.Entity("workers");
const workerListSchema = new schema.Array(workerSchema);

export const queries = {
  getWorkersQuery: () => ({
    url: "/api/workers",
    transform: response => ({
      workersById: normalize(response, workerListSchema).entities.workers
    }),
    update: {
      workersById: (prev, next) => next
    },
    options: {
      headers: {
        fakeResponse: [
          {
            id: 1,
            name: "Worker 1",
            avatar: randomAvatar(),
            status: "available"
          },
          {
            id: 2,
            name: "Worker 2",
            avatar: randomAvatar(),
            status: "busy"
          },
          {
            id: 3,
            name: "Worker 3",
            avatar: randomAvatar(),
            status: "busy"
          }
        ]
      }
    }
  })
};

export const selectors = {
  getWorkers: (state, filter) =>
    values(state.entities.workersById || {}).filter(
      worker => (filter ? worker.status === filter : true)
    )
};
