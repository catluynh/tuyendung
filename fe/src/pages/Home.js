import { Layout } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { AiFillDollarCircle, AiFillStar } from "react-icons/ai";
import { FaLaptopCode, FaUsersCog } from "react-icons/fa";
import CareerTrends from "../components/CareerTrends";
import CarouselImage from "../components/Carousel/Carousel";
import CarouselCustom from "../components/Carousel/CarouselCustom";
import FooterHome from "../components/Footer/FooterHome";
import JobList from "../components/JobHome/components/JobList";
import JobListFilter from "../components/JobHome/components/JobListFilter";
import JobProvider from "../components/JobHome/context/jobCommonContext";
import MainNavigation from "../components/Layout/MainNavigation";
import SearchCommon from "../components/Search";
import { useCommonContext } from "../components/Search/context/commonContext";
import { GlobalData } from "../data/globalData";
import CareerApi from "../services/careerApi";

const { Header, Footer, Sider, Content } = Layout;

const Home = () => {
  const { t } = useTranslation();
  const careers = GlobalData.xuHuongNgheNghiep();
  const [careersTrends, setCareersTrends] = useState([]);
  const {
    location,
    recruitmentsPartTime,
    fields,
    position,
    recruitmentsFullTime,
    listCareers,
    recruitmentsTopNews,
    companyFields,
    recruitments,
    recruitmentsApproved,
  } = useCommonContext();

  useEffect(() => {
    const getListCareerTrends = async () => {
      try {
        const response = await CareerApi.getListCareerTrends();
        console.log("getListCareerTrends", response);
        setCareersTrends(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getListCareerTrends();
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>Trang chủ | jobboard.com</title>
      </Helmet>
      <MainNavigation />

      <div className="mt-65">
        <SearchCommon
          careers={listCareers}
          fields={companyFields}
          locations={location}
        />
        <Layout>
          <JobProvider>
            <div className="container pt-5 bottom-footer">
              <Content>
                {/* Title */}
                <div className="row mt-2">
                  <div className="col-12">
                    <h4>{t("common.titleHome")}</h4>
                    <p>{t("common.titleParagraph")}</p>
                  </div>
                </div>
                {/* CarouselImage */}
                <div className="row">
                  <div className="col-12">
                    <CarouselImage />
                  </div>
                </div>

                <div className="bg-white px-3 pt-1">
                  {/* 12 tin nổi bật nhất */}
                  <div className="row mt-5">
                    <div className="col-12">
                      <h5 className="text-uppercase">
                        <AiFillStar className="pb-1" />
                        {t("common.recruitingTopNews")}
                      </h5>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <JobList recruitments={recruitmentsTopNews} />
                  </div>
                  {/* <div className="row mt-5">
                    <div className="col-12">
                      <h5 className="text-uppercase">
                        <AiFillStar className="pb-1" />
                        {t("common.titleRecruitmentNew")}
                      </h5>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <JobList recruitments={recruitments} />
                  </div> */}
                  <div className="row mt-2">
                    <div className="col-12">
                      <CarouselCustom />
                    </div>
                  </div>
                  {/* <div className="my-3">
                    <div className="row mt-4">
                      <div className="col-12">
                        <h5 className="text-uppercase">
                          <AiFillStar className="pb-1" />
                          {t("common.titlePartTimeJob")}
                        </h5>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <JobList recruitments={recruitmentsPartTime} />
                    </div>
                  </div> */}
                  {/* Three */}
                  <div className="d-flex flex-wrap mt-4 pb-5 mb-2">
                    <div className="width-33 me-4">
                      <div className="row mt-2">
                        <div className="col-12">
                          <h5 className="text-uppercase">
                            <AiFillDollarCircle className="pb-1" /> &nbsp;
                            {t("common.titleFullTimeJob")}
                          </h5>
                        </div>
                        <div
                          className="height-405 overflow-auto"
                          id="custom-scrollbar"
                        >
                          <div className="col-12">
                            <JobListFilter
                              recruitments={recruitmentsFullTime}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="width-33 me-4">
                      <div className="row mt-2">
                        <div className="col-12">
                          <h5 className="text-uppercase">
                            <FaUsersCog className="pb-1" /> &nbsp;
                            {t("common.titlePartTimeJob")}
                          </h5>
                        </div>
                        <div
                          className="height-405 overflow-auto"
                          id="custom-scrollbar"
                        >
                          <div className="col-12">
                            <JobListFilter
                              recruitments={recruitmentsPartTime}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="width-33">
                      <div className="row mt-2">
                        <div className="col-12">
                          <h5 className="text-uppercase">
                            <FaLaptopCode className="pb-1" /> &nbsp;
                            {t("common.recruitingTrainees")}
                          </h5>
                        </div>
                        <div
                          className="height-405 overflow-auto"
                          id="custom-scrollbar"
                        >
                          <div className="col-12">
                            <JobListFilter
                              recruitments={recruitmentsFullTime}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="bg-white px-3 mt-4 mb-2 py-1">
                  <div className="d-flex flex-wrap mt-4 pb-5 mb-2">
                    <div className="width-33 me-4">
                      <div className="row mt-2">
                        <div className="col-12">
                          <h5 className="text-uppercase">
                            <AiFillDollarCircle className="pb-1" /> &nbsp;
                            {t("common.recruitingTrainees")}
                          </h5>
                        </div>
                        <div
                          className="height-405 overflow-auto"
                          id="custom-scrollbar"
                        >
                          <div className="col-12">
                            <JobListFilter
                              recruitments={recruitmentsFullTime}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="width-33 me-4">
                      <div className="row mt-2">
                        <div className="col-12">
                          <h5 className="text-uppercase">
                            <FaUsersCog className="pb-1" /> &nbsp;
                            {t("common.titleManagementJob")}
                          </h5>
                        </div>
                        <div
                          className="height-405 overflow-auto"
                          id="custom-scrollbar"
                        >
                          <div className="col-12">
                            <JobListFilter recruitments={position} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="width-33">
                      <div className="row mt-2">
                        <div className="col-12">
                          <h5 className="text-uppercase">
                            <FaLaptopCode className="pb-1" /> &nbsp;
                            {t("common.titleITJob")}
                          </h5>
                        </div>
                        <div
                          className="height-405 overflow-auto"
                          id="custom-scrollbar"
                        >
                          <div className="col-12">
                            <JobListFilter recruitments={fields} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap mt-4 pb-5 mb-2">
                    <div className="width-33 me-4">
                      <div className="row mt-2">
                        <div className="col-12">
                          <h5 className="text-uppercase">
                            <AiFillDollarCircle className="pb-1" /> &nbsp;
                            {t("common.recruitingTrainees")}
                          </h5>
                        </div>
                        <div
                          className="height-405 overflow-auto"
                          id="custom-scrollbar"
                        >
                          <div className="col-12">
                            <JobListFilter
                              recruitments={recruitmentsFullTime}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="width-33 me-4">
                      <div className="row mt-2">
                        <div className="col-12">
                          <h5 className="text-uppercase">
                            <FaUsersCog className="pb-1" /> &nbsp;
                            {t("common.titleManagementJob")}
                          </h5>
                        </div>
                        <div
                          className="height-405 overflow-auto"
                          id="custom-scrollbar"
                        >
                          <div className="col-12">
                            <JobListFilter recruitments={position} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="width-33">
                      <div className="row mt-2">
                        <div className="col-12">
                          <h5 className="text-uppercase">
                            <FaLaptopCode className="pb-1" /> &nbsp;
                            {t("common.titleITJob")}
                          </h5>
                        </div>
                        <div
                          className="height-405 overflow-auto"
                          id="custom-scrollbar"
                        >
                          <div className="col-12">
                            <JobListFilter recruitments={fields} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Các ngành nghề*/}
                <div className="bg-white px-3 mt-4 mb-2">
                  <div className="row mt-2 pb-4">
                    <div className="col-12">
                      <h5 className="text-uppercase pt-4">
                        <FaUsersCog className="pb-1" /> &nbsp;
                        {t("common.careers")}
                      </h5>
                    </div>
                    <CareerTrends careers={careersTrends} />
                  </div>
                </div>
              </Content>
            </div>
          </JobProvider>
        </Layout>
        {/* <div>
          <div className="bg-white ptb-40">
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-12">
                  <div className="about">
                    <h2 class="py-3">Về chúng tôi</h2>
                    <h3>
                      TopCV là công ty công nghệ nhân sự (HR Tech) hàng đầu Việt
                      Nam. Với năng lực lõi là công nghệ, đặc biệt là trí tuệ
                      nhân tạo (AI), sứ mệnh của TopCV đặt ra cho mình là thay
                      đổi thị trường tuyển dụng - nhân sự ngày một hiệu quả hơn.
                      Bằng công nghệ, chúng tôi tạo ra nền tảng cho phép người
                      lao động tạo CV, phát triển được các kỹ năng cá nhân, xây
                      dựng hình ảnh chuyên nghiệp trong mắt nhà tuyển dụng và
                      tiếp cận với các cơ hội việc làm phù hợp.
                    </h3>
                  </div>
                </div>
                <div className="col-12 col-md-12">
                  <div className="bg-about rounded ptb-40">
                    <div className="row">
                      <div class="box-content">
                        <div class="row mb-10">
                          <div class="col-md-3">
                            <p>30.000+</p>
                            <span>
                              Ứng viên đang bật tìm việc trung bình/thời điểm
                            </span>
                          </div>
                          <div class="col-md-3">
                            <p>90.000+</p>
                            <span>Doanh nghiệp sử dụng dịch vụ</span>
                          </div>
                          <div class="col-md-3">
                            <p>120.000+</p>
                            <span>Nhà tuyển dụng sử dụng thường xuyên</span>
                          </div>
                          <div class="col-md-3">
                            <p>200.000+</p>
                            <span>Ứng viên mới mỗi tháng</span>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-3">
                            <p>3.000.000+</p>
                            <span>Lượt ứng viên truy cập hàng tháng</span>
                          </div>
                          <div class="col-md-3">
                            <p>4.000.000+</p>
                            <span>Ứng viên tiềm năng</span>
                          </div>
                          <div class="col-md-3">
                            <p>60%</p>
                            <span>Ứng viên có trên 2 năm kinh nghiệm</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <FooterHome />
      </div>
    </Fragment>
  );
};

export default Home;
