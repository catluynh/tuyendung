import { Button, Layout } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FooterHome from "../components/Footer/FooterHome";
import JobList from "../components/JobSaved/components/JobList";
import JobProvider from "../components/JobHome/context/jobCommonContext";
import MainNavigation from "../components/Layout/MainNavigation";
import InterestedJobApi from "../services/interestedJobApi";

const { Header, Footer, Sider, Content } = Layout;

const SavedJobsPage = () => {
  const [isShowSaved, setIsShowSaved] = useState(true);
  const [jobsSave, setJobsSave] = useState([]);
  const getListSavedJobs = async () => {
    try {
      const response = await InterestedJobApi.getListInterestedJob();
      console.log("response [vinh]", response);
      if (response?.status === "success") {
        if (response?.result < 1) {
          console.log("jobsSave 1", jobsSave);
          setIsShowSaved(false);
          setJobsSave([]);
        } else {
          console.log("jobsSave 2 ", jobsSave);

          setIsShowSaved(true);
          setJobsSave(response?.data);
        }
      } else {
        console.log("Status fail");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      console.log(error.response);
    }
  };
  useEffect(() => {
    getListSavedJobs();
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>Tin tuyển dụng đã lưu | jobboard.com</title>
      </Helmet>
      <MainNavigation />

      <div className="mt-65">
        <Layout>
          <JobProvider>
            <div className="container bottom-footer">
              <Content>
                <div className="my-3">
                  <h4>Việc làm đã lưu</h4>
                </div>

                <div className="bg-white px-3 pt-1 rounded">
                  {!isShowSaved && (
                    <div className="row mt-2">
                      <div className="col-12 mt-2">
                        <h5>Bạn chưa lưu việc làm nào!</h5>
                        <div className="box-content text-dark-gray">
                          <p>
                            Bạn muốn có việc làm phù hợp với năng lực bản thân?
                          </p>
                          <p>
                            Hãy tạo ngay CV trên 123Job, chúng tôi sẽ gợi ý cho
                            bạn những việc làm phù hợp nhất.
                          </p>
                        </div>
                      </div>
                      <div className="col-3 mt-2 pb-4">
                        <Button
                          type="primary"
                          className="rounded"
                          style={{ width: "100%" }}
                        >
                          <Link to="/">Tìm việc làm</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                  {isShowSaved && (
                    <div className="row mt-2 pt-1 pb-3">
                      <JobList recruitments={jobsSave} />
                    </div>
                  )}
                </div>
              </Content>
            </div>
          </JobProvider>
        </Layout>
        <FooterHome />
      </div>
    </Fragment>
  );
};

export default SavedJobsPage;
