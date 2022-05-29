import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
export const SearchContext = createContext();

const SearchContextProvider = (props) => {
  const [detail, setDetail] = useState([]);

  return (
    <SearchContext.Provider
      value={{
        detail,
        setDetail,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};
export default SearchContextProvider;

SearchContext.propTypes = {
  children: PropTypes.element,
};
