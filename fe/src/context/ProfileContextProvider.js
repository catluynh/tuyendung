import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
export const ProfileContext = createContext();

const ProfileContextProvider = (props) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditStudy, setIsEditStudy] = useState(false);
  const [detail, setDetail] = useState({});

  return (
    <ProfileContext.Provider
      value={{
        tabIndex,
        setTabIndex,
        isSubmit,
        setIsSubmit,
        isRefresh,
        setIsRefresh,
        detail,
        setDetail,
        isEdit,
        setIsEdit,
        isEditStudy,
        setIsEditStudy,
      }}
    >
      {props.children}
    </ProfileContext.Provider>
  );
};
export default ProfileContextProvider;

ProfileContext.propTypes = {
  children: PropTypes.element,
};
