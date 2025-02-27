import React from 'react';
import { bool, node } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';

import { Positions } from '../../../util/constant';
import * as validators from '../../../util/validators';
import { ROLE_COMPANY, ROLE_STUDENT } from '../../../util/types';
import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { Form, PrimaryButton, FieldTextInput, FieldRadioButton, FieldMultiSelect } from '../../../components';

import css from './SignupForm.module.css';

const SignupFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={fieldRenderProps => {
      const {
        rootClassName,
        className,
        form,
        formId,
        handleSubmit,
        inProgress,
        invalid,
        intl,
        values,
        termsAndConditions,
        pristine,
        required,
        submitCompany,
        validCompanyName,
        companyInProgress,
        companyNameError
      } = fieldRenderProps;

      const showAsRequired = pristine && required;
      const handleCompanyNameBlur = async () => {
        if (values.companyName) {
          submitCompany({ companyName: values.companyName })
        }
      };

      // email
      const emailRequired = validators.required(
        intl.formatMessage({
          id: 'SignupForm.emailRequired',
        })
      );
      const emailValid = validators.emailFormatValid(
        intl.formatMessage({
          id: 'SignupForm.emailInvalid',
        })
      );

      // password
      const passwordRequiredMessage = intl.formatMessage({
        id: 'SignupForm.passwordRequired',
      });
      const passwordMinLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooShort',
        },
        {
          minLength: validators.PASSWORD_MIN_LENGTH,
        }
      );
      const passwordMaxLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooLong',
        },
        {
          maxLength: validators.PASSWORD_MAX_LENGTH,
        }
      );
      const passwordMinLength = validators.minLength(
        passwordMinLengthMessage,
        validators.PASSWORD_MIN_LENGTH
      );
      const passwordMaxLength = validators.maxLength(
        passwordMaxLengthMessage,
        validators.PASSWORD_MAX_LENGTH
      );
      const passwordRequired = validators.requiredStringNoTrim(passwordRequiredMessage);
      const passwordValidators = validators.composeValidators(
        passwordRequired,
        passwordMinLength,
        passwordMaxLength
      );

      const companyRequired = validators.required(
        intl.formatMessage({
          id: 'SignupForm.CompanyRequired',
        })
      );

      const classes = classNames(rootClassName || css.root, className, values.userType == ROLE_COMPANY && css.companySignupRoot);
      const submitInProgress = inProgress;
      const submitDisabled = invalid || submitInProgress || (values.userType == ROLE_COMPANY ? (!validCompanyName) : null);

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <div>
            {/* <h6 className={css.radioHeading}>
              {intl.formatMessage({
                id: 'SignupForm.RadioHeading',
              })}
            </h6> */}
            <div className={css.radioInput}>
              {/* student */}
              <div className={css.buttonText}>
                <FieldRadioButton
                  id={formId ? `${formId}.student` : 'student'}
                  name='userType'
                  label={intl.formatMessage({
                    id: 'SignupForm.Student'
                  })}
                  value={ROLE_STUDENT}
                  className={className}
                  rootClassName={rootClassName}
                  showAsRequired={showAsRequired}
                />
              </div>
              {/* company */}
              <div className={css.buttonText}>
                <FieldRadioButton
                  id={formId ? `${formId}.company` : 'company'}
                  name='userType'
                  label={intl.formatMessage({
                    id: 'SignupForm.Company'
                  })}
                  value={ROLE_COMPANY}
                  className={className}
                  rootClassName={rootClassName}
                  showAsRequired={showAsRequired} />
              </div>
            </div>
          </div>
          <div>
            {/* for company */}
            {values.userType == ROLE_COMPANY
              ? <><FieldTextInput
                type="text"
                id={formId ? `${formId}.email` : 'email'}
                name="companyName"
                className={css.companyText}
                label={intl.formatMessage({
                  id: 'SignupForm.CompanyName',
                })}
                placeholder={intl.formatMessage({
                  id: 'SignupForm.CompanyNamePlaceholder',
                })}
                maxLength={150}
                validate={companyRequired}
                onBlur={handleCompanyNameBlur}

              />
                {validCompanyName ? null : <span className={css.error}>{companyNameError}</span>}
              </>
              : null}
            {values.userType == ROLE_COMPANY
              ? <FieldMultiSelect
                id={formId ? `${formId}.position` : 'position'}
                name="position"
                className={css.fieldSelect}
                data={Positions}
                onChange={selected => form.change('position', selected)}
                label={
                  intl.formatMessage({
                    id: 'SignupForm.addYourPosition'
                  })
                }
              //  validate={required(intl.formatMessage({ id: "CompanySignup.industryRequired" }))}
              />
              : null}

            {/* email */}
            <FieldTextInput
              type="email"
              id={formId ? `${formId}.email` : 'email'}
              name="email"
              className={values.userType == ROLE_COMPANY ? css.emailBoxCompany : css.emailBox}
              autoComplete="email"
              label={intl.formatMessage({
                id: 'SignupForm.emailLabel',
              })}
              placeholder={intl.formatMessage({
                id: 'SignupForm.emailPlaceholder',
              })}
              validate={validators.composeValidators(emailRequired, emailValid)}
            />
            <div className={css.name}>
              <FieldTextInput
                className={css.firstNameRoot}
                type="text"
                id={formId ? `${formId}.fname` : 'fname'}
                name="fname"
                autoComplete="given-name"
                label={intl.formatMessage({
                  id: 'SignupForm.firstNameLabel',
                })}
                placeholder={intl.formatMessage({
                  id: 'SignupForm.firstNamePlaceholder',
                })}
                validate={validators.required(
                  intl.formatMessage({
                    id: 'SignupForm.firstNameRequired',
                  })
                )}
              />
              <FieldTextInput
                className={css.lastNameRoot}
                type="text"
                id={formId ? `${formId}.lname` : 'lname'}
                name="lname"
                autoComplete="family-name"
                label={intl.formatMessage({
                  id: 'SignupForm.lastNameLabel',
                })}
                placeholder={intl.formatMessage({
                  id: 'SignupForm.lastNamePlaceholder',
                })}
                validate={validators.required(
                  intl.formatMessage({
                    id: 'SignupForm.lastNameRequired',
                  })
                )}
              />
            </div>
            <FieldTextInput
              className={css.password}
              type="password"
              id={formId ? `${formId}.password` : 'password'}
              name="password"
              autoComplete="new-password"
              label={intl.formatMessage({
                id: 'SignupForm.passwordLabel',
              })}
              placeholder={intl.formatMessage({
                id: 'SignupForm.passwordPlaceholder',
              })}
              validate={passwordValidators}
            />
          </div>

          <div className={css.bottomWrapper}>
            <div className={classNames(css.additionalText, values.userType == ROLE_COMPANY && css.additionalTextCompany)}>
              {termsAndConditions}
            </div>
            <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
              <FormattedMessage id="SignupForm.signUp" />
            </PrimaryButton>
          </div>
        </Form>
      );
    }}
  />
);

SignupFormComponent.defaultProps = { inProgress: false };

SignupFormComponent.propTypes = {
  inProgress: bool,
  termsAndConditions: node.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const SignupForm = compose(injectIntl)(SignupFormComponent);
SignupForm.displayName = 'SignupForm';

export default SignupForm;