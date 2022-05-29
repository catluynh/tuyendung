import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
} from "../constants/authConstants";

const user = JSON.parse(localStorage?.getItem("user"));
const initialState = user
  ? {
      isAuthenticated: true,
      loading: true,
      user,
    }
  : {
      isAuthenticated: false,
      loading: true,
      user: null,
    };

export const userLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return {
        ...action.state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case USER_LOGIN_FAIL:
      return {
        ...action.state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
      };
    case USER_LOGOUT:
      return {
        ...state,
        loading: false,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
