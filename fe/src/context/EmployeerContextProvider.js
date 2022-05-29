import React, { createContext } from "react";
import PropTypes from "prop-types";
export const EmployeerContext = createContext();

const EmployeerContextProvider = (props) => {
  return (
    <EmployeerContext.Provider value={{}}>
      {props.children}
    </EmployeerContext.Provider>
  );
};
export default EmployeerContextProvider;

EmployeerContext.propTypes = {
  children: PropTypes.element,
};
