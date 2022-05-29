import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import MainNavigation from "../components/Layout/MainNavigation";
import { Breadcrumb, Col, Layout, Menu, Modal, Row } from "antd";
import { Helmet } from "react-helmet";
import FooterHome from "../components/Footer/FooterHome";
import ProfileMyPage from "./User/ProfileMyPage";
const { Header, Footer, Sider, Content } = Layout;

const ProfilePage = () => {
  const currentUser = useSelector((state) => state.userLogin.userInfor);
  console.log("currentUser", currentUser);

  return (
    <Fragment>
      <Helmet>
        <title>Hồ sơ của tôi | jobboard.com</title>
      </Helmet>
      <MainNavigation />
      <div className="mt-65">
        <Layout>
          <div className="container pt-3 bottom-footer">
            <Content>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ProfileMyPage />
                </Col>
              </Row>
            </Content>
          </div>
        </Layout>
        <FooterHome />
      </div>
    </Fragment>
  );
};

export default ProfilePage;
