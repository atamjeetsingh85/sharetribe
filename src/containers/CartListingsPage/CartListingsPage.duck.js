import { parse } from '../../util/urlHelpers';
import { storableError } from '../../util/errors';
import { createImageVariantConfig } from '../../util/sdkLoader';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
const RESULT_PAGE_SIZE = 42;

// ================ Action types ================ //

export const FETCH_CART_ITEMS_REQUEST = 'app/CartPage/FETCH_CART_ITEMS_REQUEST';
export const FETCH_CART_ITEMS_SUCCESS = 'app/CartPage/FETCH_CART_ITEMS_SUCCESS';
export const FETCH_CART_ITEMS_ERROR = 'app/CartPage/FETCH_CART_ITEMS_ERROR';

// ================ Reducer ================ //

const initialState = {
  pagination: null,
  queryParams: null,
  queryInProgress: false,
  queryCartsError: null,
  currentCartPageResultIds: [],
};

const cartItemIds = data => data.data.map(l => l.id);

const cartListingsPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_CART_ITEMS_REQUEST:
      return {
        ...state,
        queryParams: payload.queryParams,
        queryInProgress: true,
        queryCartsError: null,
        currentCartPageResultIds: [],
      };
    case FETCH_CART_ITEMS_SUCCESS:
      return {
        ...state,
        currentCartPageResultIds: cartItemIds(payload.data),
        pagination: payload.data.meta,
        queryInProgress: false,
      };
    case FETCH_CART_ITEMS_ERROR:
      console.error(payload);
      return {
        ...state,
        queryInProgress: false,
        queryCartsError: payload,
      };
    default:
      return state;
  }
};
export default cartListingsPageReducer;

// ================ Action creators ================ //

export const queryCartsRequest = queryParams => ({
  type: FETCH_CART_ITEMS_REQUEST,
  payload: { queryParams },
});

export const queryCartsSuccess = response => ({
  type: FETCH_CART_ITEMS_SUCCESS,
  payload: { data: response.data },
});

export const queryCartsError = e => ({
  type: FETCH_CART_ITEMS_ERROR,
  error: true,
  payload: e,
});


// ================ Thunks ================ //

export const queryCartItems = queryParams => (dispatch, getState, sdk) => {
  dispatch(queryCartsRequest(queryParams));
  const { currentUser } = getState().user;
  const { cart } = currentUser?.attributes.profile.privateData || {};

  const cartMaybe = cart ? { ids: cart } : {};
  const { perPage, ...rest } = queryParams;
  const params = { ...cartMaybe, ...rest, perPage };

  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(queryCartsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(queryCartsError(storableError(e)));
      throw e;
    });
};

export const loadData = (params, search, config) => {
  const queryParams = parse(search);
  const page = queryParams.page || 1;

  const {
    aspectWidth = 1,
    aspectHeight = 1,
    variantPrefix = 'listing-card',
  } = config.layout.listingImage;
  const aspectRatio = aspectHeight / aspectWidth;

  return queryCartItems({
    ...queryParams,
    page,
    perPage: RESULT_PAGE_SIZE,
    include: ['images'],
    'fields.image': [`variants.${variantPrefix}`, `variants.${variantPrefix}-2x`],
    ...createImageVariantConfig(`${variantPrefix}`, 400, aspectRatio),
    ...createImageVariantConfig(`${variantPrefix}-2x`, 800, aspectRatio),
    'limit.images': 1,
  });
};

