import React, {createContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import JobServices from "../services/jobServices";
export const JobCommonContext = createContext({
  apiData: {
    listRecruitment: []
  }
});

const JobProvider = ({children, ...props}) => {
  const {t} = useTranslation('common');
  const [apiData, setApiData] = useState({
    listRecruitment: []
  });
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    JobServices
      .loadAllApiData()
      .then((data) => {
        if (data) {
          setApiData(data);
        }
      })
      .catch((error) =>
        console.log(error)
      );
  }, []);


  return (
    <JobCommonContext.Provider
      value={{
        apiData
      }}>
      {children}
    </JobCommonContext.Provider>
  );
};

JobProvider.propTypes = {
  children: PropTypes.any,
};

export default JobProvider;

export function useRecruitments() {
  return React.useContext(JobCommonContext);
}

