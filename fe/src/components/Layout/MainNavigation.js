import { Fragment, useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../redux/actions/authActions";
import { MdArrowDropDown } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { getUserProfile } from "../../utils/localStorage";
import Logo from "../../assets/logo/logo_remove_bg.png";
import { useTranslation } from "react-i18next";
import { IMAGE_LOGO, UNG_TUYEN_VIEN } from "../../constansts/common";
import { NHA_TUYEN_DUNG } from "../../utils/roles";

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
  const [isRoleEmployer, setIsRoleEmployer] = useState(false);
  // const isAuthenticated = useSelector(
  //   (state) => state.userLogin.isAuthenticated
  // );
  const userQ = useSelector((state) => state.userLogin);
  const roles = userQ?.user?.taiKhoan?.loaiTaiKhoan;
  // console.log("isAuthenticated employer::", user);
  console.log("isAuthenticated employer roles layout::", roles);

  useEffect(() => {
    if (roles === NHA_TUYEN_DUNG) {
      setIsRoleEmployer(true);
      console.log("aaa");
    } else {
      setIsRoleEmployer(false);
      console.log("bbb");
    }
  }, [roles]);
  const [user, setUser] = useState(() => {
    return getUserProfile();
  });
  const t = useTranslation();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.taiKhoan?._id) {
        setUser(getUserProfile());
      }
    } else {
      <Redirect to="/login" />;
    }
  }, []);

  useEffect(() => {
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
  const renderProfileForRole = () => {
    if (isAuthenticated) {
      if (roles === UNG_TUYEN_VIEN) {
        console.log("render logined");
        return (
          <>
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
            <li className="nav-item dropdown d-flex align-items-center dropdown-toggle">
              <img
                style={avatarStyle}
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
                  <NavLink to="/user/account/password" className="text-dark">
                    Đổi mật khẩu
                  </NavLink>
                </li>
                <li className="dropdown-item bg-none">
                  <a
                    // href="javascript:void(0)"
                    onClick={logoutHandler}
                    className="text-decoration-none text-dark"
                  >
                    Đăng xuất
                  </a>
                </li>
              </ul>
            </li>
          </>
        );
      } else {
        return <></>;
      }
    } else if (!isAuthenticated) {
      return (
        <>
          <li className="nav-item mt-1">
            <NavLink to="/login" className="nav-link" aria-current="page">
              Đăng nhập
            </NavLink>
          </li>
          <li className="nav-item mt-1">
            <NavLink to="/sign-up" className="nav-link">
              Đăng ký
            </NavLink>
          </li>
        </>
      );
    }
  };
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark position-fixed top-0 z-index-999 w-100">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img style={logoStyle} src={IMAGE_LOGO} alt="Logo" />
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 z-index-999">
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
                <ul
                  className="dropdown-menu z-index-999"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <NavLink to="/" className="dropdown-item">
                      Tìm việc làm
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/jobs/applied-jobs" className="dropdown-item">
                      Việc làm đã ứng tuyển
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/jobs/saved-jobs" className="dropdown-item">
                      Việc làm đã lưu
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0 z-index-999">
              {/* {isAuthenticated && (
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
              )} */}
              {/* {isAuthenticated && (
                <li className="nav-item dropdown d-flex align-items-center dropdown-toggle">
                  <img
                    style={avatarStyle}
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
              )} */}

              {/* {!isAuthenticated && (
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
              )} */}
              {renderProfileForRole()}
              <li className="nav-item mt-1">
                <NavLink
                  style={borderStyle}
                  className="nav-link"
                  to="/employer/dashboard"
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
