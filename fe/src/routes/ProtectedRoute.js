import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
  const isAuthenticated = useSelector(
    (state) => state.userLogin.isAuthenticated
  );
  const user = useSelector((state) => state.userLogin);
  console.log("isAuthenticated aaa::", isAuthenticated);
  console.log("isAuthenticated user::", user);
  
  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
