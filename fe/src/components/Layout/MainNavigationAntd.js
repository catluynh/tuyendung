import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../redux/actions/authActions";
import { MdArrowDropDown } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { getUserProfile } from "../../utils/localStorage";
import Logo from "../../assets/logo/logo_remove_bg.png";
const logoStyle = {
  height: "35px",
  width: "auto",
};
const avatarStyle = {
  width: "45px",
  height: "45px",
  maxWidth: "100%",
};
const borderStyle = {
  border: "0.5px solid #918a88",
  borderRadius: "6px",
};

const MainNavigation = () => {
  const { isAuthenticated } = useSelector((state) => state?.userLogin);
  const [user, setUser] = useState(() => {
    return getUserProfile();
  });
  console.log("isAuthenticated", isAuthenticated);
  console.log("user", user);
  useEffect(() => {
    console.log("Localstorage");
    console.log("isAuthenticated", isAuthenticated);
    if (isAuthenticated) {
      if (user?.taiKhoan?._id) {
        setUser(getUserProfile());
      }
    } else {
      <Redirect to="/login" />;
    }
  }, []);
  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    console.log("Localstorage");
    if (!isAuthenticated) {
      if (user?.taiKhoan?._id) {
        setUser(getUserProfile());
      }
    } else {
      <Redirect to="/login" />;
    }
  }, [user?.taiKhoan?._id]);
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Đăng xuất thành công", {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    window.location.reload();
  };
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img
              style={logoStyle}
              src="https://123job.vn/images/logo_tim.png"
              alt="Logo"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
            style={{ fontSize: "14px" }}
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item mt-1">
                <NavLink to="/kham-pha" className="nav-link">
                  Khám phá
                </NavLink>
              </li>
              <li className="nav-item mt-1 dropdown">
                <NavLink
                  to="viec-lam"
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Việc Làm
                </NavLink>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <NavLink to="/tim-viec-lam" className="dropdown-item">
                      Tìm việc làm
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/viec-lam-ung-tuyen" className="dropdown-item">
                      Việc làm đã ứng tuyển
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/viec-lam-da-luu" className="dropdown-item">
                      Việc làm đã lưu
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0">
              {isAuthenticated && (
                <li className="nav-item mt-1">
                  <NavLink
                    to="/user/profile"
                    className="nav-link d-flex align-items-center"
                    aria-current="page"
                  >
                    <AiOutlinePlusCircle color="white" size="16px" />
                    &nbsp;Hồ sơ của tôi
                  </NavLink>
                </li>
              )}
              {isAuthenticated && (
                <li className="nav-item dropdown d-flex align-items-center dropdown-toggle">
                  <img
                    style={avatarStyle}
                    // src="https://mdbootstrap.com/img/Photos/Avatars/img%20(20).jpg"
                    src="https://123job.vn/images/no_user.png"
                    alt="Avatar"
                    className="md-avatar rounded-circle nav-link "
                    id="navbarDropdown-profile"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                  <MdArrowDropDown color="white" size="16px" />
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown-profile"
                  >
                    <li className="dropdown-item pe-none">
                      <b>{user?.taiKhoan?.tenDangNhap}</b>
                    </li>
                    <li className="dropdown-item bg-none">
                      <NavLink to="/user/account" className="text-dark">
                        Thiết lập tài khoản
                      </NavLink>
                    </li>
                    <li className="dropdown-item bg-none">
                      <NavLink
                        to="/user/account/password"
                        className="text-dark"
                      >
                        Đổi mật khẩu
                      </NavLink>
                    </li>
                    <li className="dropdown-item bg-none">
                      <a
                        onClick={logoutHandler}
                        className="text-decoration-none text-dark"
                      >
                        Đăng xuất
                      </a>
                    </li>
                  </ul>
                </li>
              )}

              {!isAuthenticated && (
                <li className="nav-item mt-1">
                  <NavLink to="/login" className="nav-link" aria-current="page">
                    Đăng nhập
                  </NavLink>
                </li>
              )}
              {!isAuthenticated && (
                <li className="nav-item mt-1">
                  <NavLink to="/sign-up" className="nav-link">
                    Đăng ký
                  </NavLink>
                </li>
              )}
              <li className="nav-item mt-1">
                <NavLink
                  style={borderStyle}
                  className="nav-link"
                  to="/account/create"
                >
                  Nhà tuyển dụng đăng tin
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default MainNavigation;
