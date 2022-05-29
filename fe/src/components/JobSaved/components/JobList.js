import React from "react";
import JobItem from "./JobItem";

const JobList = ({ recruitments }) => {
  return (
    <>
      {recruitments.length !== undefined
        ? recruitments.map((jobs, index) => {
            return (
              <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-6">
                <JobItem jobs={jobs} />
              </div>
            );
          })
        : null}
    </>
  );
};

export default JobList;
