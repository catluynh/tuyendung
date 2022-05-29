import { Layout, Button } from "antd";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import FooterHome from "../components/Footer/FooterHome";
import JobList from "../components/JobApplied/components/JobList";
import JobProvider from "../components/JobHome/context/jobCommonContext";
import MainNavigation from "../components/Layout/MainNavigation";
import AppliedJobApi from "../services/appliedJobApi";
import { Link } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;

const AppliedJobsPage = () => {
  const [isShowSaved, setIsShowSaved] = useState(true);
  const [jobsSave, setJobsSave] = useState([]);
  const getListAppliedJobs = async () => {
    try {
      const response = await AppliedJobApi.getListAppliedJob();
      setJobsSave(response?.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      console.log(error.response);
    }
  };
  useEffect(() => {
    getListAppliedJobs();
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>Việc làm đã ứng tuyển | jobboard.com</title>
      </Helmet>
      <MainNavigation />

      <div className="mt-65">
        <Layout>
          <JobProvider>
            <div className="container bottom-footer">
              <Content>
                <div className="my-3">
                  <h4>Việc làm đã ứng tuyển</h4>
                </div>

                <div className="bg-white px-3 pt-1 rounded">
                  {!isShowSaved && (
                    <div className="row mt-2">
                      <div className="col-12 mt-2">
                        <h5>Bạn chưa ứng tuyển việc làm nào!</h5>
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
                      <JobList recruitments={jobsSave} onSubmit />
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

export default AppliedJobsPage;
