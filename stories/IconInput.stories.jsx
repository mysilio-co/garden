import React from 'react'
import { Formik } from 'formik'
import { IconInput } from '../components/inputs'
import { Search as SearchIcon } from '../components/icons'

export default {
  component: IconInput,
  title: 'Components/IconInput',
}

export const Search = () => (
  <Formik>
    <IconInput
      type="search"
      name="example"
      placeholder="Search"
      icon={<SearchIcon className="ipt-header-search-icon" />}
      inputClassName="ipt-header-search"
    />
  </Formik>
)
Search.parameters = {
  backgrounds: { default: 'dark' },
}
