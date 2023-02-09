import { Formik } from 'formik';
import { Search as SearchIcon } from './icons';
import { IconInput } from './inputs';

export default function Search({}) {
  return (
    <Formik>
      <IconInput
        type="search"
        name="search"
        placeholder="Search"
        icon={<SearchIcon className="ipt-header-search-icon" />}
        inputClassName="ipt-header-search"
        onChange={(e) => {
          e.preventDefault();
        }}
      />
    </Formik>
  );
}
