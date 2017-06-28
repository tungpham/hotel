import { normalize, schema } from "normalizr";
import { values } from "lodash";
import { mutateAsync } from "redux-query";

const guestOrderSchema = new schema.Entity("guestOrders");
const guestOrderListSchema = new schema.Array(guestOrderSchema);

const guestSuggestionSchema = new schema.Entity("guestSuggestions");
const guestSuggestionListSchema = new schema.Array(guestSuggestionSchema);

const fakeData = search => {
  let fakeGuests = [
    {
      id: 1,
      name: "Messi",
      tags: [{ label: "VIP Customer", color: "danger" }],
      phone: "(760) 621 - 5500",
      favourite: true,
      message: {
        date: new Date(),
        message: "Lorem ipsum dolor..."
      }
    },
    {
      id: 2,
      name: "Ronaldo",
      tags: [],
      phone: "(760) 621 - 5500",
      favourite: false,
      message: {
        date: new Date(),
        message: "Lorem ipsum dolor..."
      }
    },
    {
      id: 3,
      name: "Unknown",
      tags: [{ label: "SAMPLE", color: "default" }],
      phone: "(760) 621 - 5500",
      favourite: false,
      message: {
        date: new Date(),
        message: "Lorem ipsum dolor..."
      }
    }
  ];

  const suggestions = !!search
    ? fakeGuests.filter(
        guest => guest.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
      )
    : [];

  if (search && suggestions.length === 0) {
    fakeGuests = fakeGuests.map(guest => ({
      ...guest,
      message: {
        date: new Date(),
        message: `Sample: <b>${search}</b>... working`
      }
    }));
  }

  return {
    guests: fakeGuests,
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
    mutateAsync(queries.changeFavouriteMutation(id, favourite))
};

export const selectors = {
  guestOrders: state => values(state.entities.guestOrdersById || {}),
  guestSuggestions: state => state.entities.guestSuggestions || []
};
