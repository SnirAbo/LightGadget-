const initialState = { products: [] };

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_PRODUCT':
      return { ...state, products: action.payload };

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };

    case 'REMOVE_PRODUCT':
      return { ...state, products: state.products.filter(product => product._id !== action.payload._id) };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload._id ? { ...product, ...action.payload.data } : product
        ),
      };

    default:
      return state;
  }
};

export default productReducer;
