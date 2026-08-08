const initialState = {
    cart: [],
  };
  
  const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'INCREMENT_QUANTITY':
        return {
          ...state,
          cart: state.cart.map(item =>
            item._id === action.payload
              ? { ...item, quantity: Math.min(item.quantity + 1, item.stock ?? Infinity) }
              : item
          ),
        };
  
      case 'DECREMENT_QUANTITY':
        return {
          ...state,
          cart: state.cart.map(item =>
            item._id === action.payload && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
        case 'SET_QUANTITY':
        return {
          ...state,
          cart: state.cart.map(item =>
            item._id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        };

        case 'ADD_TO_CART': {
          const existingItem = state.cart.find(item => item._id === action.payload._id);
          const selectedQty = action.payload.selectedQty ?? 1;
          if (existingItem) {
            return {
              ...state,
              cart: state.cart.map(item =>
                item._id === action.payload._id
                  ? { ...item, quantity: Math.min(item.quantity + selectedQty, item.stock ?? Infinity) }
                  : item
              )
            };
          } else {
            return {
              ...state,
              cart: [...state.cart, { ...action.payload, stock: action.payload.quantity, quantity: selectedQty }]
            };
          }
        }
        
         case 'REMOVE_FROM_CART':
            return {
              ...state,
              cart: state.cart.filter(item => item._id !== action.payload._id),
            };

       case 'CLEAR_CART':
        return {
         ...state,
          cart: [],
         };


      default:
        return state;
    }
  };
  
  
  export default cartReducer;
  