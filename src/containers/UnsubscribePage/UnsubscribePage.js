// import React from 'react';
// import { shape, string } from 'prop-types';
// import { FormattedMessage } from '../../util/reactIntl';
// import { Page, LayoutSingleColumn } from '../../components';

// import css from './UnsubscribePage.module.css';

// const UnsubscribePage = props => {
//   const { status } = props;

//   let messageId;
//   switch (status) {
//     case 'success':
//       messageId = 'UnsubscribePage.successMessage';
//       break;
//     case 'not_found':
//       messageId = 'UnsubscribePage.notFoundMessage';
//       break;
//     case 'error':
//     default:
//       messageId = 'UnsubscribePage.errorMessage';
//   }

//   return (
//     <Page title="Unsubscribe">
//       <LayoutSingleColumn className={css.root}>
//         <h1 className={css.title}>
//           <FormattedMessage id="UnsubscribePage.title" />
//         </h1>
//         <p className={css.message}>
//           <FormattedMessage id={messageId} />
//         </p>
//       </LayoutSingleColumn>
//     </Page>
//   );
// };

// UnsubscribePage.propTypes = {
//   status: string,
// };

// export default UnsubscribePage;

import React from 'react';

const UnsubscribePage = () => {
  return <p>You have successfully unsubscribed.</p>;
};

export default UnsubscribePage;
