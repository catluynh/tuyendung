import { Layout, Menu, Breadcrumb } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { Fragment } from "react";
import { FaListUl } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const MainNavigationAdmin = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Fragment>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item icon={<DesktopOutlined />} key="1">
              Trang chủ
            </Menu.Item>
            <Menu.SubMenu title="Tin tuyển dụng" icon={<FaListUl />} key="2">
              <Menu.Item key="2sub1">
                <Link to={"/employer/dashboard"}>Quản lý tin</Link>
              </Menu.Item>
              <Menu.Item key="2sub2">Thêm mới tin</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              title="Hồ sơ ứng tuyển"
              icon={<TeamOutlined />}
              key="3"
            >
              <Menu.Item key="3sub1">Tất cả hồ sơ</Menu.Item>
              <Menu.Item key="3sub2">Hồ sơ tiềm năng</Menu.Item>
              <Menu.Item key="3sub3">Mới ứng tuyển</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item icon={<DesktopOutlined />} key="4">
              Thông tin công ty
            </Menu.Item>
            <Menu.Item icon={<GoSignOut />} key="5">
              Đăng xuất
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </Fragment>
  );
};
export default MainNavigationAdmin;
