const initialState = { orders: [] };

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_ORDER':
      return { ...state, orders: action.payload };

    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };

    case 'REMOVE_ORDER':
      return { ...state, orders: state.orders.filter(order => order._id !== action.payload._id) };

    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order._id === action.payload._id ? { ...order, ...action.payload.data } : order
        ),
      };

    default:
      return state;
  }
};

export default orderReducer;
