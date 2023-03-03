export const PlayerEditReducer = (state, action) => {
  switch (action.type) {
    case "EDIT":
      //console.log(action.payload);
      return {
        pInfo: action.payload,
      };
    case "END":
      return {
        pInfo: null,
      };
    default:
      return state;
  }
};
