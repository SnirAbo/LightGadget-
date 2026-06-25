import { v4 as uuidv4 } from 'uuid';

const initialState = {
    users: [],
    currentUser: null,
  };
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_USERS':
            return { ...state, users: action.payload };
            
        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, { ...action.payload, id: uuidv4() }],
            };
        case 'REMOVE_USER':
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload.id),
            };
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map(user =>
                    user.id === action.payload.id ? { ...user, ...action.payload.data } : user
                ),
            };
            case 'LOGIN_USER':
             return {
                ...state,
                currentUser: action.payload, // payload = המשתמש שמחובר
          };
        case 'LOGOUT_USER':
             return {
                ...state,
                currentUser: null,
           }; 

        default:
            return state;
    }
} 

export default userReducer;