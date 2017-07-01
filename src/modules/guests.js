import { normalize, schema } from "normalizr";
import { values, omit } from "lodash";
import { mutateAsync } from "redux-query";

const guestsSchema = new schema.Entity("guests");
const guestsListSchema = new schema.Array(guestsSchema);

const guestOrderSchema = new schema.Entity("guestOrders");
const guestOrderListSchema = new schema.Array(guestOrderSchema);

const guestSuggestionSchema = new schema.Entity("guestSuggestions");
const guestSuggestionListSchema = new schema.Array(guestSuggestionSchema);

const fakeGuests = [
  {
    id: 1,
    name: "Messi",
    lastName: "Last",
    tags: [{ label: "VIP Customer", color: "danger" }],
    phone: "(760) 621 - 5500",
    room: "101",
    favourite: true,
    message: {
      date: new Date(),
      message: "Lorem ipsum dolor..."
    }
  },
  {
    id: 2,
    name: "Ronaldo",
    lastName: "Last",
    tags: [],
    phone: "(760) 621 - 5500",
    room: "102",
    favourite: false,
    message: {
      date: new Date(),
      message: "Lorem ipsum dolor..."
    }
  },
  {
    id: 3,
    name: "Unknown",
    lastName: "Last",
    tags: [{ label: "SAMPLE", color: "default" }],
    phone: "(760) 621 - 5500",
    room: "103",
    favourite: false,
    message: {
      date: new Date(),
      message: "Lorem ipsum dolor..."
    }
  }
];

const fakeData = search => {
  let tmp = fakeGuests;

  const suggestions = !!search
    ? tmp.filter(
        guest => guest.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
      )
    : [];

  if (search && suggestions.length === 0) {
    tmp = tmp.map(guest => ({
      ...guest,
      message: {
        date: new Date(),
        message: `Sample: <b>${search}</b>... working`
      }
    }));
  }

  return {
    guests: tmp,
    suggestions
  };
};

export const queries = {
  getGuestOrdersQuery: search => ({
    url: `/api/guest-orders?search=${search}`,
    force: true,
    transform: response => {
      const normalized = normalize(response, {
        guests: guestOrderListSchema,
        suggestions: guestSuggestionListSchema
      });

      return {
        guestOrdersById: normalized.entities.guestOrders,
        guestSuggestions: values(normalized.entities.guestSuggestions)
      };
    },
    update: {
      guestOrdersById: (prev, next) => next,
      guestSuggestions: (prev, next) => next
    },
    options: {
      headers: {
        fakeResponse: fakeData(search)
      }
    }
  }),
  getGuestsQuery: () => ({
    url: `/api/guests`,
    transform: response => {
      const normalized = normalize(response, guestsListSchema);

      console.log(normalized);

      return {
        guestsById: normalized.entities.guests
      };
    },
    update: {
      guestsById: (prev, next) => next
    },
    options: {
      headers: {
        fakeResponse: fakeGuests
      }
    }
  }),
  addGuestMutation: values => {
    const id = ((Math.random() * 0xffffff) << 0).toString(16);
    return {
      url: `/api/guests`,
      queryKey: "/api/guests/add",
      transform: data => ({
        guestsById: { [id]: { ...data, tags: data.tags ? data.tags : [] } }
      }),
      update: {
        guestsById: (prev, next) => ({
          ...prev,
          ...next
        })
      },
      options: {
        headers: {
          fakeResponse: { ...values, id }
        }
      }
    };
  },
  editGuestMutation: (id, values) => ({
    url: `/api/guests`,
    queryKey: "/api/guests/edit",
    transform: data => ({ guestsById: { [id]: data } }),
    update: {
      guestsById: (prev, next) => ({
        ...prev,
        ...next
      })
    },
    options: {
      headers: {
        fakeResponse: values
      }
    }
  }),
  removeGuestMutation: id => ({
    url: `/api/guest/${id}`,
    queryKey: `/api/guest/${id}/remove`,
    transform: data => ({ guestsById: id }),
    update: {
      guestsById: (prev, next) => omit(prev, id)
    },
    options: {
      headers: {
        fakeResponse: {}
      }
    }
  }),
  changeFavouriteMutation: (id, favourite) => ({
    url: `/api/guest/${id}`,
    body: { favourite },
    transform: () => ({ guestOrdersById: { [id]: {} } }),
    update: {
      guestOrdersById: prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          favourite: favourite
        }
      })
    },
    optimisticUpdate: {
      guestOrdersById: prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          favourite: favourite
        }
      })
    },
    options: {
      headers: {
        fakeResponse: {}
      }
    }
  })
};

export const actions = {
  favourite: (id, favourite) =>
    mutateAsync(queries.changeFavouriteMutation(id, favourite)),
  editGuest: (id, values) => mutateAsync(queries.editGuestMutation(id, values)),
  addGuest: (id, values) => mutateAsync(queries.addGuestMutation(id, values)),
  removeGuest: (id, values) =>
    mutateAsync(queries.removeGuestMutation(id, values))
};

export const selectors = {
  guestOrders: state => values(state.entities.guestOrdersById || {}),
  guestSuggestions: state => state.entities.guestSuggestions || [],
  guests: state => values(state.entities.guestsById || {}),
  guest: (state, id) => (state.entities.guestsById || {})[id]
};
