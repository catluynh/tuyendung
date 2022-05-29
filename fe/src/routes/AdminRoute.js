import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, useHistory } from "react-router-dom";
import { UNG_TUYEN_VIEN } from "../constansts/common";
import { NHA_TUYEN_DUNG, QUAN_TRI_VIEN } from "../utils/roles";

const AdminRoute = ({ component: Component, ...restOfProps }) => {
  const history = useHistory();
  const isAuthenticated = useSelector(
    (state) => state.userLogin.isAuthenticated
  );
  const user = useSelector((state) => state.userLogin);
  const roles = user?.user?.taiKhoan?.loaiTaiKhoan;
  console.log("isAuthenticated employer::", user);
  console.log(
    "isAuthenticated employer roles::",
    user?.user?.taiKhoan?.loaiTaiKhoan
  );
  useEffect(() => {
    if (isAuthenticated && roles === QUAN_TRI_VIEN) {
      console.log("1. co quyen");
      // history.push("/admin/dashboard");
    } else if (!isAuthenticated) {
      // history.push("/login")
      <Redirect to="/login" />;
    }
  }, [isAuthenticated, roles]);

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default AdminRoute;
