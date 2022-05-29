import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const ProductContext = createContext({});

const ProductProvider = ({ children, ...props }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [detail, setDetail] = useState({ a: 1 });

  return (
    <ProductContext.Provider
      value={{ detail, setDetail, isSubmit, setIsSubmit }}
    >
      {children}
    </ProductContext.Provider>
  );
};

ProductProvider.propTypes = {
  children: PropTypes.any,
};

export default ProductProvider;

export function useProductContext() {
  return React.useContext(ProductContext);
}
