const initialState = { users: [], currentUser: null };

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_USERS':
      return { ...state, users: action.payload };

    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };

    case 'REMOVE_USER':
      return { ...state, users: state.users.filter(user => user._id !== action.payload._id) };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload._id ? { ...user, ...action.payload.data } : user
        ),
      };

    case 'LOGIN_USER':
      return { ...state, currentUser: action.payload };

    case 'LOGOUT_USER':
      return { ...state, currentUser: null };

    default:
      return state;
  }
};

export default userReducer;
