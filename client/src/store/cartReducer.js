const initialState = {
    cart: [],
  };
  
  const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'INCREMENT_QUANTITY':
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
  
      case 'DECREMENT_QUANTITY':
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
        case 'SET_QUANTITY':
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        };

                case 'LOAD_CATEGORY':
        return { ...state, categories: action.payload };
        
        case 'ADD_TO_CART': {
          const existingItem = state.cart.find(item => item.id === action.payload.id);
          if (existingItem) {
            return {
              ...state,
              cart: state.cart.map(item =>
                item.id === action.payload.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          } else {
            return {
              ...state,
              cart: [...state.cart, { ...action.payload, quantity: 1 }]
            };
          }
        }
        
         case 'REMOVE_FROM_CART':
            return {
              ...state,
              cart: state.cart.filter(item => item.id !== action.payload.id),
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
  