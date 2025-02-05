import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { isScrollingDisabled } from '../../ducks/ui.duck';

import {
  H3,
  Page,
  PaginationLinks,
  UserNav,
  LayoutSingleColumn,
  ListingCard,
} from '../../components';

import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';

import css from './CartListingsPage.module.css';
import { getListingsById } from '../../ducks/marketplaceData.duck';

export const CartListingsPageComponent = props => {
  const { cartListings, pagination, queryInProgress, queryCartsError, queryParams, scrollingDisabled, intl } = props;
  console.log('listings', cartListings);

  const hasPaginationInfo = !!pagination && pagination.totalItems != null;
  const listingsAreLoaded = !queryInProgress && hasPaginationInfo;

  const loadingResults = (
    <div className={css.messagePanel}>
      <H3 as="h2" className={css.heading}>
        <FormattedMessage id="CartListingsPage.loadingCartListings" />
      </H3>
    </div>
  );

  const queryError = (
    <div className={css.messagePanel}>
      <H3 as="h2" className={css.heading}>
        <FormattedMessage id="CartListingsPage.queryError" />
      </H3>
    </div>
  );

  const noResults =
    listingsAreLoaded && pagination.totalItems === 0 ? (
      <H3 as="h1" className={css.heading}>
        <FormattedMessage id="CartListingsPage.noResults" />
      </H3>
    ) : null;

  const heading =
    listingsAreLoaded && pagination.totalItems > 0 ? (
      <H3 as="h1" className={css.heading}>
        <FormattedMessage
          id="CartListingsPage.youHaveListings"
          values={{ count: pagination.totalItems }}
        />
      </H3>
    ) : (
      noResults
    );

  const page = queryParams ? queryParams.page : 1;
  const paginationLinks =
    listingsAreLoaded && pagination && pagination.totalPages > 1 ? (
      <PaginationLinks
        className={css.pagination}
        pageName="CartListingsPage"
        pageSearchParams={{ page }}
        pagination={pagination}
      />
    ) : null;

  const title = intl.formatMessage({ id: 'CartListingsPage.title' });

  const panelWidth = 62.5;
  const renderSizes = [
    `(max-width: 767px) 100vw`,
    `(max-width: 1920px) ${panelWidth / 2}vw`,
    `${panelWidth / 3}vw`,
  ].join(', ');

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSingleColumn
        topbar={
          <>
            <TopbarContainer currentPage="CartListingsPage" />
            <UserNav currentPage="CartListingsPage" />
          </>
        }
        footer={<FooterContainer />}
      >
        {queryInProgress ? loadingResults : null}
        {queryCartsError ? queryError : null}
        <div className={css.listingPanel}>
          {heading}
          <div className={css.listingCards}>
            {cartListings?.map(l => (
              <ListingCard
                className={css.listingCard}
                key={l.id.uuid}
                listing={l}
                renderSizes={renderSizes}
              />
            ))}
          </div>
          {paginationLinks}
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};


const { arrayOf, bool, object } = PropTypes;  
CartListingsPageComponent.propTypes = {
  cartListings: arrayOf(propTypes.listing),
  pagination: propTypes.pagination,
  queryInProgress: bool.isRequired,
  queryCartsError: propTypes.error,
  queryParams: object,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    currentCartPageResultIds,
    pagination,
    queryInProgress,
    queryCartsError,
    queryParams,
  } = state.CartListingsPage;
  const cartListings = getListingsById(state, currentCartPageResultIds);
  return {
    currentCartPageResultIds,
    cartListings,
    pagination,
    queryInProgress,
    queryCartsError,
    queryParams,
    scrollingDisabled: isScrollingDisabled(state),
  };
};

const CartListingsPage = compose(
  connect(mapStateToProps),
  injectIntl
)(CartListingsPageComponent);

export default CartListingsPage;
