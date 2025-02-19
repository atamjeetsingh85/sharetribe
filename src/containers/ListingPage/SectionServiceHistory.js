import React from 'react';
import SectionTextMaybe from './SectionTextMaybe';

import css from './ListingPage.module.css';
import { formatDateIntoPartials } from '../../util/dates';

const SectionServiceHistoryMaybe = props => {
  const { intl, publicData } = props;
  const { lastServiced, serviceDetails } =
    publicData?.serviceHistory || {};
  if (!lastServiced && !serviceDetails) {
    return null;
  }

  const formattedServiceDate = formatDateIntoPartials(
    new Date(lastServiced),
    intl
  );

  return (
    <div className={css.sectionServiceHistory}>
      <SectionTextMaybe
        heading={intl.formatMessage({
          id: 'SectionServiceHistoryMaybe.lastServicedHeading',
        })}
        text={formattedServiceDate.date}
      />
      <SectionTextMaybe
        heading={intl.formatMessage({
          id: 'SectionServiceHistoryMaybe.serviceDetailsHeading',
        })}
        text={serviceDetails}
      />
    </div>
  );
};

export default SectionServiceHistoryMaybe;