const initialState = {
    categories:[],
  };

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_CATEGORY':
        return { ...state, categories: action.payload };

        default:
            return state;
    }
} 

export default categoryReducer;