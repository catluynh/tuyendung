import PropTypes from "prop-types";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoSignOut } from "react-icons/go";
import { FaListUl } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../../../redux/actions/authActions";
import { toast } from "react-toastify";
import React, { Fragment, useEffect, useState } from "react";
import axiosClient from "../../../../services/axiosClient";
import { use } from "i18next";
import { useHistory } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

const NavbarAdmin = (props) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const dispatch = useDispatch();
  const [totalAll, setTotalAll] = useState();
  const history = useHistory();

  useEffect(() => {
    const getTotalRecruitments = async () => {
      const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/tongSoTinTheoTrangThaiNhaTuyenDung`;
      try {
        const response = await axiosClient.get(requestUrl).then((res) => {
          let total = 0;
          res.data.map((item) => {
            total = total + item.tong;
            setTotalAll(total);
          });
        });
      } catch (error) {
        console.log(error.response);
      }
    };
    getTotalRecruitments();
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
    toast.success("Đăng xuất thành công", {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <Fragment>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item icon={<DesktopOutlined />} key="1">
            Trang chủ
            <Link to="/employer/dashboard" />
          </Menu.Item>
          <Menu.SubMenu title="Tin tuyển dụng" icon={<FaListUl />} key="sub1">
            <Menu.Item key="2">
              Quản lý tin
              <Link to="/employer/dashboard" />
            </Menu.Item>
            <Menu.Item
              key="3"
              onClick={() => {
                // if (totalAll >= 3) {
                //   history.replace('/employer/job/payment')
                // } else if (totalAll < 3) {
                //   history.replace('/employer/job/create')
                // }
                history.replace("/employer/job/create");
              }}
            >
              Thêm mới tin
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            title="Hồ sơ ứng tuyển"
            icon={<TeamOutlined />}
            key="sub2"
          >
            <Link to="/employer/job/apply-job/all" />
            <Menu.Item key="4">
              Tất cả đơn ứng tuyển
              <Link to="/employer/job/apply-job/all" />
            </Menu.Item>
            <Menu.Item key="5">
              Đơn tiềm năng
              <Link to="/employer/job/apply-job/talent" />
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item icon={<DesktopOutlined />} key="6">
            Thông tin công ty
            <Link to="/employer/account/profile" />
          </Menu.Item>
          <Menu.Item icon={<GoSignOut />} key="7" onClick={logoutHandler}>
            Đăng xuất
            <Link to="/" />
          </Menu.Item>
        </Menu>
      </Sider>
    </Fragment>
  );
};

NavbarAdmin.propTypes = {};

export default NavbarAdmin;
