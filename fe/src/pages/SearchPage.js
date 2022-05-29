import React, { Fragment, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import MainNavigation from "../components/Layout/MainNavigation";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { SearchContext } from "../context/SearchContextProvider";
import JobListFilter from "../components/JobHome/components/JobListFilter";
import { AiFillStar } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { Col, Layout, Row } from "antd";
import JobProvider from "../components/JobHome/context/jobCommonContext";
import { Content } from "antd/lib/layout/layout";
import SearchCommon from "../components/Search";
import { useCommonContext } from "../components/Search/context/commonContext";
import JobList from "../components/JobHome/components/JobList";

const SearchPage = (props) => {
  const queryParams = useLocation().search;
  const keyword = new URLSearchParams(queryParams);
  console.log("ttv queryParams  ", queryParams);
  const [results, setResults] = useState([]);
  const { t } = useTranslation();
  const { location, listCareers, companyFields } = useCommonContext();
  const [isHide, setIsHide] = useState(false);

  console.log("queryParams", queryParams);

  const searchProducts = async () => {
    console.log("Call api in search");
    const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/timKiemTheoNhieuTieuChi${queryParams}`;
    console.log("ttv requestUrl  ", requestUrl);
    try {
      const response = await axios.get(requestUrl);
      console.log("... tttv response", response);
      //  setRecruitmentList(response);
      setResults(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    let isMounted = true;
    console.log("result", results);

    if (results?.data?.length === 0) {
      setIsHide(true);
    } else {
      if (isMounted) {
        setIsHide(false);
        searchProducts();
      }
    }

    return () => {
      setResults([]);
      isMounted = false;
    };
  }, [queryParams]);
  return (
    <Fragment>
      <Helmet>
        <title>Trang tìm kiếm| jobboard.com</title>
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
            <div className="container pt-2 bottom-footer bg-white my-4">
              <div className="row">
                <div className="col-12 pt-1 border-bottom">
                  {results?.data?.length >= 1 ? (
                    <p>
                      Tìm thấy <strong>{results?.data?.length}</strong> việc làm
                      phù hợp với yêu cầu của bạn
                    </p>
                  ) : (
                    <p>Không tìm thấy dữ liệu</p>
                  )}
                </div>
              </div>
              <Content>
                <div className="row mt-3">
                  <JobList recruitments={results.data} />
                </div>
                <div className="my-3"></div>
              </Content>
            </div>
          </JobProvider>
        </Layout>
      </div>
    </Fragment>
  );
};

SearchPage.propTypes = {};

export default SearchPage;
