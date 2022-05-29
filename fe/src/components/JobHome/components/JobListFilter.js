import React, { Fragment, useEffect, useState } from "react";
import JobItem from "./JobItem";

const JobListFilter = ({ recruitments }) => {
  return (
    <>
      {recruitments
        ? recruitments.map((jobs, index) => {
            return (
              <div key={index} className="col-12">
                <JobItem jobs={jobs} />
              </div>
            );
          })
        : null}
    </>
  );
};

export default JobListFilter;
