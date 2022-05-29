import React, { Fragment, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

const PostFiltersForm = (props) => {
  const { onSubmit } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(e.target.value);
    if (!onSubmit) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      const formValues = {
        searchTerm: value,
      };
      onSubmit(formValues);
    }, 500);
  };
  return (
    <Fragment>
      <Input
        className="form-control"
        placeholder={props.title ? props.title : "Tên, sdt"}
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
    </Fragment>
  );
};

PostFiltersForm.propTypes = {
  onSubmit: PropTypes.func,
};
PostFiltersForm.defaultProps = {
  onSubmit: null,
};

export default PostFiltersForm;
