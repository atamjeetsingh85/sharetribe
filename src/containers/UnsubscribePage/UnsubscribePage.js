import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ensureCurrentUser } from '../../util/data';
import { Page, LayoutSingleColumn, Button, IconSpinner } from '../../components';
import { connect } from 'react-redux';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { unsubscribeUserAPI } from '../../util/api';
import css from './UnsubscribePage.module.css';
import { FormattedMessage } from '../../util/reactIntl';

const UnsubscribePage = props => {
  const history = useHistory();
  const location = useLocation();
  const user = ensureCurrentUser(props.currentUser);
  const uuid = user?.id?.uuid;
const[success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUnsubscribeClick = async () => {
    if (!uuid) {
      setError('UnsubscribePage.missingUserId'); 
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await unsubscribeUserAPI(uuid);

      if (response.success) {
        setSuccess(true); 
      } else {
        setError(response.message || 'UnsubscribePage.unsubscribeFailed'); 

      }
    } catch (err) {
      setError('UnsubscribePage.errorMessage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Unsubscribe">
      <LayoutSingleColumn className={css.root}>
        <div className={css.container}>
          <h1 className={css.title}>
            <FormattedMessage id="UnsubscribePage.title" />
          </h1>
  
          {success ? (
            <p className={css.successMessage}>
              <FormattedMessage id="UnsubscribePage.successMessage" />
            </p>
          ) : (
            <>
              <p className={css.description}>
                <FormattedMessage id="UnsubscribePage.description" />
              </p>
  
              {error && (
                <p className={css.error}>
                  <FormattedMessage id={error} />
                </p>
              )}
  
              <Button className={css.unsubscribeButton} onClick={handleUnsubscribeClick} disabled={loading}>
                {loading ? <IconSpinner size="small" /> : <FormattedMessage id="UnsubscribePage.buttonText" />}
              </Button>
            </>
          )}
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  return {
    currentUser,
    scrollingDisabled: isScrollingDisabled(state),
  };
};

export default connect(mapStateToProps)(UnsubscribePage);

