// import React, { createContext, useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { useTranslation } from "react-i18next";
// import JobServices from "../services/jobServices";
// import RecruitmentApi from "../../../services/recruitmentApi";
// export const JobCommonContext = createContext({
//   apiData: {
//     listRecruitment: [],
//   },
// });

// const JobProvider = ({ children, ...props }) => {
//   const { t } = useTranslation("common");
//   const [loading, setLoading] = useState(true);

//   return (
//     <JobCommonContext.Provider value={{}}>{children}</JobCommonContext.Provider>
//   );
// };

// JobProvider.propTypes = {
//   children: PropTypes.any,
// };

// export default JobProvider;

// export function useRecruitments() {
//   return React.useContext(JobCommonContext);
// }
