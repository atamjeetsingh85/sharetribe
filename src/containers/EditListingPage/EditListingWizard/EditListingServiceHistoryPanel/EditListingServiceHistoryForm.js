import React from 'react';
import { bool, func, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import { futureIsOutsideRange } from '../../../../util/dates';

// These relative imports need to point to correct directories
import {
  intlShape,
  injectIntl,
  FormattedMessage,
} from '../../../../util/reactIntl';
import { propTypes } from '../../../../util/types';
import {
  Form,
  Button,
  FieldTextInput,
} from '../../../../components';
import FieldSingleDatePicker from '../../../../components/DatePicker/FieldSingleDatePicker/FieldSingleDatePicker';
// Create this file using EditListingPricingForm.module.css
// as a template.
import css from './EditListingServiceHistoryForm.module.css';

export const EditListingServiceHistoryFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        disabled,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateError,
        updateInProgress,
      } = formRenderProps;

      const errorMessage = updateError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingServiceHistoryForm.updateFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = updated && pristine;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          <FieldSingleDatePicker
            className={css.input}
            id="lastServiced"
            name="lastServiced"
            label={intl.formatMessage({
              id: 'EditListingServiceHistoryForm.lastServiced',
            })}
          />

          <FieldTextInput
            className={css.input}
            id="serviceDetails"
            name="serviceDetails"
            type="textarea"
            label={intl.formatMessage({
              id: 'EditListingServiceHistoryForm.serviceDetails',
            })}
          />

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingServiceHistoryFormComponent.defaultProps = {
  selectedPlace: null,
  updateError: null,
};

EditListingServiceHistoryFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
};

export default compose(injectIntl)(
  EditListingServiceHistoryFormComponent
);