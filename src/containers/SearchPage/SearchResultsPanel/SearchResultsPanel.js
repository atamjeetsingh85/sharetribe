import React from 'react';
import classNames from 'classnames';

import { propTypes } from '../../../util/types';
import { ListingCard, PaginationLinks,Button,SecondaryButton } from '../../../components';

import css from './SearchResultsPanel.module.css';
import { FormattedMessage, useIntl } from '../../../util/reactIntl';

/**
 * SearchResultsPanel component
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.rootClassName] - Custom class that extends the default class for the root element
 * @param {Array<propTypes.listing>} props.listings - The listings
 * @param {propTypes.pagination} props.pagination - The pagination
 * @param {Object} props.search - The search
 * @param {Function} props.setActiveListing - The function to handle the active listing
 * @param {boolean} [props.isMapVariant] - Whether the map variant is enabled
 * @returns {JSX.Element}
 */
const SearchResultsPanel = props => {
  const {
    className,
    rootClassName,
    listings = [],
    pagination,
    search,
    setActiveListing,
    isMapVariant = true,onToggleCarts,currentUser
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const paginationLinks =
    pagination && pagination.totalPages > 1 ? (
      <PaginationLinks
        className={css.pagination}
        pageName="SearchPage"
        pageSearchParams={search}
        pagination={pagination}
      />
    ) : null;

  const cardRenderSizes = isMapVariant => {
    if (isMapVariant) {
      // Panel width relative to the viewport
      const panelMediumWidth = 50;
      const panelLargeWidth = 62.5;
      return [
        '(max-width: 767px) 100vw',
        `(max-width: 1023px) ${panelMediumWidth}vw`,
        `(max-width: 1920px) ${panelLargeWidth / 2}vw`,
        `${panelLargeWidth / 3}vw`,
      ].join(', ');
    } else {
      // Panel width relative to the viewport
      const panelMediumWidth = 50;
      const panelLargeWidth = 62.5;
      return [
        '(max-width: 549px) 100vw',
        '(max-width: 767px) 50vw',
        `(max-width: 1439px) 26vw`,
        `(max-width: 1920px) 18vw`,
        `14vw`,
      ].join(', ');
    }
  };
  const filteredListings = listings.filter(l => {
    const isPrivate = l.attributes.publicData?.isPrivate || false;
    const isOwner = currentUser && l.id.uuid === currentUser.id.uuid;
    return !isPrivate || isOwner; // Show public listings OR private listings if user is the owner
  });
  return (
    <div className={classes} >
      <div className={isMapVariant ? css.listingCardsMapVariant : css.listingCards}>
        {filteredListings.map(l =>{
           const isCart = currentUser?.attributes?.profile?.privateData?.carts?.includes(l.id.uuid);
           const toggleCarts = (e) =>   {  
            e.preventDefault();
            if (!onToggleCarts) return; // Ensure function exists

            console.log("toggleCarts",l.id.uuid,isCart);
            onToggleCarts(l.id.uuid, isCart);}
          
       return (<div key={l.id.uuid}> 
          <ListingCard       
            className={css.listingCard}
            key={l.id.uuid}
            listing={l}
            renderSizes={cardRenderSizes(isMapVariant)}
            setActiveListing={setActiveListing ? setActiveListing : () => {}}
          />
          <div>
          {isCart ? (
            <SecondaryButton

              className={css.cartButton}
              onClick={toggleCarts}
            >
              <FormattedMessage id="SearchResultPanel.uncartButton" />
            </SecondaryButton>
          ) : (
            <Button className={css.cartButton}
            onClick={toggleCarts}>
              <FormattedMessage id="SearchResultPanel.addCartButton" />
            </Button>
          )}       </div></div>

        )})}
        {props.children}
      </div>
      {paginationLinks}
    </div>
  );
};

export default SearchResultsPanel;
