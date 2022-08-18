import { useState, useMemo } from 'react';

import WebMonetization from '../components/WebMonetization';
import GardenHeader from '../components/GardenHeader';
import { Loader } from '../components/elements';
import LeftNavLayout from '../components/LeftNavLayout';
import Card from '../components/cards/Card';

import useDWCStream from '../model/dweb-camp';

export default function DWebCampStreamPage() {
  const [search, setSearch] = useState('');
  const { stream } = useDWCStream();
  const monetizeFor = useMemo(() => {
    const randomEntry =
      stream && stream[Math.floor(Math.random() * stream.length)];
    return randomEntry && randomEntry.creator;
  }, [stream]);
  const headerProps = useMemo(
    () => ({
      onSearch: setSearch,
      type: 'dweb',
    }),
    [setSearch]
  );
  return (
    <LeftNavLayout
      pageName="Dweb Camp"
      HeaderComponent={GardenHeader}
      headerProps={headerProps}
    >
      <WebMonetization webId={monetizeFor} />
      <div className="p-6">
        {stream ? (
          stream.map((props) => {
            return <Card {...props} />;
          })
        ) : (
          <Loader />
        )}
      </div>
    </LeftNavLayout>
  );
}
