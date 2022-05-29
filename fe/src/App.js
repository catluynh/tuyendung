import "antd/dist/antd.min.css";
import { Fragment } from "react";
import { Helmet } from "react-helmet";
import { Route, Switch, useHistory, withRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import SearchCommon from "./components/Search";
import ProductDetail from "./features/Product/pages/ProductDetail";
import AllProfilePage from "./pages/Admin/AllProfilePage";
import AllProfileTalentPage from "./pages/Admin/AllProfileTalentPage";
import DashBoard from "./pages/Admin/DashBoard";
import InformationProfilePage from "./pages/Admin/InformationProfilePage";
import InformationProfilePageQTV from "./pages/QTV/InformationProfilePageQTV";
import NewForProfileDetail from "./pages/Admin/NewForProfileDetail";
import NewJob from "./pages/Admin/NewJob";
import AppliedJobsPage from "./pages/AppliedJobsPage";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import DashBoardQTV from "./pages/QTV/DashBoardQTV";
import DashBoardQTVCandidates from "./pages/QTV/DashBoardQTVCandidates";
import DashBoardQTVEmployer from "./pages/QTV/DashBoardQTVEmployer";
import SavedJobsPage from "./pages/SavedJobsPage";
import SearchPage from "./pages/SearchPage";
import SeachPage from "./pages/SearchPage";
import AccountSetupPage from "./pages/User/AccountSetupPage";
import ChangePasswordPage from "./pages/User/ChangePasswordPage";
import { FogotPasswordPage } from "./pages/User/FogotPasswordPage";
import JobDetailPage from "./pages/User/JobDetailPage";
import ResetPasswordPage from "./pages/User/ResetPasswordPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ConfirmRegisterAccountSuccess } from "./pages/User/components/ConfirmRegisterAccountSuccess";
import AccessDenied from "./components/AccessDenied";
import { Payment } from "./pages/Admin/Payment";
import EmployerRoute from "./routes/EmployerRoute";
import AdminRoute from "./routes/AdminRoute";

function App(props) {
  return (
    <Fragment>
      <Helmet>
        <title>
          Tuyển dụng, việc làm 24h từ 50.000+ công ty uy tín hàng đầu tại Việt
          Nam
        </title>
      </Helmet>

      <Switch>
        <Route path="/" component={Home} exact />
        <Route exact path="/access-denied" component={AccessDenied} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/sign-up" component={Register} />
        {/* <Route exact path="/appled-jobs" component={AppliedJobsPage} />*/}
        <ProtectedRoute
          exact
          path="/jobs/saved-jobs"
          component={SavedJobsPage}
        />
        <ProtectedRoute
          exact
          path="/jobs/applied-jobs"
          component={AppliedJobsPage}
        />
        <Route exact path="/forgot-password" component={FogotPasswordPage} />
        {/* EMPLOYER START */}
        <EmployerRoute exact path="/employer/dashboard" component={DashBoard} />
        <EmployerRoute exact path="/employer/job/create" component={NewJob} />
        <EmployerRoute
          exact
          path="/employer/job/detail/:id"
          component={NewForProfileDetail}
        />
        <EmployerRoute
          exact
          path="/employer/account/profile"
          component={InformationProfilePage}
        />
        <EmployerRoute
          exact
          path="/employer/job/apply-job/all"
          component={AllProfilePage}
        />
        <EmployerRoute
          exact
          path="/employer/job/apply-job/talent"
          component={AllProfileTalentPage}
        />
        <EmployerRoute exact path="/employer/job/payment" component={Payment} />
        {/* EMPLOYER ENND */}
        <Route exact path="/job-detail/:slug" component={ProductDetail} />
        <Route exact path="/company/:uniqueId" component={ProductDetail} />
        <Route exact path="/search" component={SearchPage} />
        <ProtectedRoute exact path="/user/profile" component={ProfilePage} />
        <ProtectedRoute
          exact
          path="/user/account/password"
          component={ChangePasswordPage}
        />
        <ProtectedRoute
          exact
          path="/user/account"
          component={AccountSetupPage}
        />
        <Route
          exact
          path="/auth/register/verified"
          component={ConfirmRegisterAccountSuccess}
        />
        <Route
          exact
          path="/auth/verified/:token"
          component={ResetPasswordPage}
        />
        {/* ADMIN START */}
        <AdminRoute exact path="/admin/dashboard" component={DashBoardQTV} />
        <AdminRoute
          exact
          path="/admin/employers"
          component={DashBoardQTVEmployer}
        />
        <AdminRoute
          exact
          path="/admin/candidates"
          component={DashBoardQTVCandidates}
        />
        <AdminRoute
          exact
          path="/admin/profile"
          component={InformationProfilePageQTV}
        />
        {/* ADMIN END */}
        <Route path="/404-error">
          <NotFound />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <ToastContainer autoClose={1000} hideProgressBar={true} />
      {/* Footer */}
    </Fragment>
  );
}

export default withRouter(App);
