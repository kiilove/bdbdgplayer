export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      console.log("action", action.payload);
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
