import { storableError } from '../../util/errors';
import { parse } from '../../util/urlHelpers';
import { unsubscribeUserAPI } from '../../util/api'; // Import API function

// ================ Action types ================ //
export const UNSUBSCRIBE_REQUEST = 'app/UnsubscribePage/UNSUBSCRIBE_REQUEST';
export const UNSUBSCRIBE_SUCCESS = 'app/UnsubscribePage/UNSUBSCRIBE_SUCCESS';
export const UNSUBSCRIBE_ERROR = 'app/UnsubscribePage/UNSUBSCRIBE_ERROR';

// ================ Reducer ================ //

const initialState = {
    queryInProgress: false,
    unsubscribeSuccess: false,
    queryError: null,
  };

  const unsubscribePageReducer = (state = initialState, action = {}) => {
    const { type, payload } = action;
  
    switch (type) {
      case UNSUBSCRIBE_REQUEST:
        return { ...state, queryInProgress: true, queryError: null, unsubscribeSuccess: false };
  
      case UNSUBSCRIBE_SUCCESS:
        return { ...state, queryInProgress: false, unsubscribeSuccess: true ,queryError: null };
  
      case UNSUBSCRIBE_ERROR:
        return { ...state, queryInProgress: false, queryError: payload };
  
      default:
        return state;
    }
  };
  export default unsubscribePageReducer;


// ================ Action creators ================ //

  export const unsubscribeRequest = () => ({
    type: UNSUBSCRIBE_REQUEST,
  });
  
  export const unsubscribeSuccess = () => ({
    type: UNSUBSCRIBE_SUCCESS,
  });
  
  export const unsubscribeError = error => ({
    type: UNSUBSCRIBE_ERROR,
    payload: error,
    error: true,
  });
  

// ================ Thunks ================ //

export const unsubscribeUser = uuid => async dispatch => {
    dispatch(unsubscribeRequest());
  
    try {
      const response = await unsubscribeUserAPI(uuid); // Call API
      console.log("Unsubscribe response:", response);
      dispatch(unsubscribeSuccess());
    } catch (error) {
      console.error("Error unsubscribing user:", error);
      dispatch(unsubscribeError(storableError(error)));
    }
  };
export const loadData = (params, search) => (dispatch, getState, sdk) => {
  const queryParams = parse(search);
  const uuid = queryParams.uuid;

  if (uuid) {
    return dispatch(unsubscribeUser(uuid))
      .catch(error => {
        console.error('Error unsubscribing user:', error);
        return dispatch(unsubscribeError(storableError(error)));
      });
  }
  return Promise.resolve(null);

};
