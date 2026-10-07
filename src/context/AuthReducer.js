export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        userInfo: action.payload,
      };
      break;
    case "LOGOUT":
      return {
        userInfo: null,
      };
      break;

    default:
      return state;
  }
};
