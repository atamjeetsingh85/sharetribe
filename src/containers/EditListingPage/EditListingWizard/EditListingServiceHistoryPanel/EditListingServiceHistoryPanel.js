import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../../../util/types';

// Import shared components
import { ListingLink } from '../../../../components';

// Import modules from this directory
import EditListingServiceHistoryForm from './EditListingServiceHistoryForm';

// Create this file using EditListingLocationPanel.module.css
// as a template.
import css from './EditListingServiceHistoryPanel.module.css';

const getInitialValues = props => {
  const { serviceHistory } =
    props.listing?.attributes?.publicData || {};
  const { lastServiced, serviceDetails } = serviceHistory || {};

  return {
    lastServiced: {
      date: (lastServiced && new Date(lastServiced)) || null,
    },
    serviceDetails,
  };
};

const EditListingServiceHistoryPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const isPublished =
    listing?.id && listing?.attributes.state !== LISTING_STATE_DRAFT;
  const initialValues = getInitialValues(props);

  return (
    <div className={classes}>
      <h1 className={css.title}>
        {isPublished ? (
          <FormattedMessage
            id="EditListingServiceHistoryPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} /> }}
          />
        ) : (
          <FormattedMessage id="EditListingServiceHistoryPanel.createListingTitle" />
        )}
      </h1>
      <EditListingServiceHistoryForm
        className={css.form}
        initialValues={initialValues}
        onSubmit={values => {
          const { lastServiced, serviceDetails } = values;

          const updateValues = {
            publicData: {
              serviceHistory: {
                lastServiced: lastServiced?.date?.toJSON() || null,
                serviceDetails,
              },
            },
          };

          onSubmit(updateValues);
        }}
        saveActionMsg={submitButtonText}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        autoFocus
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingServiceHistoryPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingServiceHistoryPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingServiceHistoryPanel;