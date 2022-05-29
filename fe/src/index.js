import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import "./i18n";
import GlobalStyles from "./components/GlobalStyles";
import CommonProvider from "./components/Search/context/commonContext";
import ProductProvider from "./features/Product/context/ProductContext";
import ProfileContextProvider from "./context/ProfileContextProvider";
import SearchContextProvider from "./context/SearchContextProvider";
import { ConfigProvider } from "antd";
import vi_VN from "antd/lib/locale/vi_VN";
import { EmployeerContext } from "./context/EmployeerContextProvider";
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <GlobalStyles>
          <CommonProvider>
            <ProductProvider>
              <ProfileContextProvider>
                <SearchContextProvider>
                  <ConfigProvider locale={vi_VN}>
                    <App />
                  </ConfigProvider>
                </SearchContextProvider>
              </ProfileContextProvider>
            </ProductProvider>
          </CommonProvider>
        </GlobalStyles>
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
