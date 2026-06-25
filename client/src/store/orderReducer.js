const initialState = {
    orders:[],
  };

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_ORDER':
            return { ...state, orders: action.payload };
      
          case 'ADD_ORDER':
            return {
              ...state,
              orders: [...state.orders, action.payload],
            };
      
          case 'REMOVE_ORDER':
            return {
              ...state,
              orders: state.orders.filter(order => order.id !== action.payload.id),
            };
      
          case 'UPDATE_ORDER':
            return {
              ...state,
              orders: state.orders.map(order =>
                order.id === action.payload.id ? { ...order, ...action.payload.data } : order
              ),
            };

        default:
            return state;
    }
} 

export default orderReducer;