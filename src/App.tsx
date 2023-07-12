import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppContext, useAppContext } from "./shared/functions/Context";
import { LoadingEllipsis } from "./shared/components/Loading";
import AppApi from "./shared/apis/AppApi";
import AppStore from "./shared/stores/AppStore";
import UiStore from "./shared/stores/UiStore";
import SnackbarManager from "./shared/components/snackbar/SnackbarManager";
import useNetwork from "./shared/hooks/useNetwork";
import { observer } from "mobx-react-lite";
import { USER_ROLES } from "./shared/constants/USER_ROLES";
import Dashboard from "./logged_in_admin/dashboard/Dashboard";
import FAQ from "./logged_in_admin/faq/FAQ";
import EmployeeDashboard from "./logged_in_client/dashboard/EmployeeDashboard";
import PrivateRoute from "./logged_in_admin/shared/PrivateRoute";
import "../src/shared/sass/styles.scss";
import AppearanceSettings from "./logged_in_admin/team/Appearence/AppearenceSettings";
import { Documents } from "./logged_in_admin/bcms/documents/Documents";
import { Accounting } from "./logged_in_admin/bcms/accounting/Accounting";
import { Communication } from "./logged_in_admin/bcms/communication/Communication";
import { BodyCorperates } from "./logged_in_admin/bcms/bodyCorperates/BodyCorporate/BodyCorperates";
import Owners from "./logged_in_admin/bcms/bodyCorperates/Owners";
import { ViewUnit } from "./logged_in_admin/bcms/bodyCorperates/BodyCorporate/units/ViewUnits";
import { UnitInfor } from "./logged_in_admin/bcms/bodyCorperates/BodyCorporate/units/UnitInfo";
import { OwnerAccount } from "./logged_in_admin/bcms/owner-accounts/OwnerAccounts";
import Settings from "./logged_in_admin/profiles/Settings";
import Departments from "./logged_in_admin/team/departments/Departments";
import Employees from "./logged_in_admin/team/employees/Employees";
import { Meetings } from "./logged_in_admin/bcms/meetings/Meetings";
import { UnitYear } from "./logged_in_admin/bcms/bodyCorperates/BodyCorporate/units/UnitYear";
import { UnitMonth } from "./logged_in_admin/bcms/bodyCorperates/BodyCorporate/units/UnitMonth";
import { Invoices } from "./logged_in_admin/bcms/accounting/invoices/Invoices";
import { RecurringInvoices } from "./logged_in_admin/bcms/accounting/recuring-invoices/RecuringInvoices";
import { ExpenseTracking } from "./logged_in_admin/bcms/accounting/expense-tracking/ExpenseTracking";
import { VerifyInvoice } from "./logged_in_admin/bcms/accounting/invoices/VerifyInvoice";

const SignIn = lazy(() => import("./logged_out/sign_in/SignIn"));
const LoggedIn = lazy(() => import("./logged_in_admin/LoggedIn"));

const PrivateLoggedIn = () => (
  <PrivateRoute>
    <LoggedIn />
  </PrivateRoute>
);

const ADMIN_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          <Route path={`dashboard`} element={<Dashboard />} />

          <Route
            path={`communication/com-overview`}
            element={<Communication />}
          />

          <Route path={`meetings/meetings-overview`} element={<Meetings />} />

          <Route
            path={`documents/documents-overview`}
            element={<Documents />}
          />

          <Route
            path={`accounting/accounting-overview`}
            element={<Accounting />}
          />
          <Route path={`accounting/invoices`} element={<Invoices />} />
          <Route
            path={`accounting/recuring-invoices`}
            element={<RecurringInvoices />}
          />
          <Route
            path={`accounting/expense-tracking`}
            element={<ExpenseTracking />}
          />

          <Route path={`body/body-corperate`} element={<BodyCorperates />} />
          <Route
            path={`body/body-corperate/:propertyId`}
            element={<ViewUnit />}
          />
          <Route
            path={`/c/body/body-corperate/:propertyId/:id`}
            element={<UnitInfor />}
          />

          <Route
            path={`/c/body/body-corperate/:propertyId/:id/:yearId`}
            element={<UnitYear />}
          />
          <Route
            path={`/c/body/body-corperate/:propertyId/:id/:yearId/:monthId`}
            element={<UnitMonth />}
          />

          <Route
            path={`/c/body/body-corperate/:propertyId/:id/:yearId/:monthId/:invoiceId`}
            element={<VerifyInvoice />}
          />

          <Route path={`body/owners`} element={<Owners />} />

          <Route path={`admin/employees`} element={<Employees />} />
          <Route path={`admin/departments`} element={<Departments />} />

          <Route path={`admin/appearance`} element={<AppearanceSettings />} />
          <Route path={`settings`} element={<Settings />} />
          <Route path={`FAQ`} element={<FAQ />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>
        <Route path="/" element={<SignIn />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

const OWNER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          <Route path={`dashboard`} element={<Dashboard />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
          <Route path={`unit/owner-units`} element={<OwnerAccount />} />
        </Route>
        <Route path="/" element={<SignIn />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

const EMPLOYEE_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          <Route path={`dashboard`} element={<Dashboard />} />

          <Route
            path={`communication/com-overview`}
            element={<Communication />}
          />

          <Route path={`meetings/meetings-overview`} element={<Meetings />} />

          <Route
            path={`documents/documents-overview`}
            element={<Documents />}
          />

          <Route
            path={`accounting/accounting-overview`}
            element={<Accounting />}
          />

          <Route path={`body/body-corperate`} element={<BodyCorperates />} />
          <Route path={`body/body-corperate/:id`} element={<ViewUnit />} />
          <Route
            path={`/c/body/body-corperate/unitInfo/:id`}
            element={<UnitInfor />}
          />

          <Route path={`body/owners`} element={<Owners />} />

          <Route path={`admin/employees`} element={<Employees />} />
          <Route path={`admin/departments`} element={<Departments />} />
          <Route path={`admin/appearance`} element={<AppearanceSettings />} />
          <Route path={`settings`} element={<Settings />} />
          <Route path={`FAQ`} element={<FAQ />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>
        <Route path="/" element={<SignIn />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

// Lotsengineering2022 or @2022
// new transnamib.unicomms.app c8R7Dn9ZvGvEyDd

const MainRoutes = observer(() => {
  const { store } = useAppContext();
  const role = store.user.role;

  useNetwork();

  const adminRoles = [
    USER_ROLES.ADMIN,
    USER_ROLES.MANAGER,
    USER_ROLES.GENERAL_MANAGER,
    USER_ROLES.MANAGING_DIRECTOR,
    USER_ROLES.BOARD_MEMBER,
    USER_ROLES.DIRECTOR,
    USER_ROLES.HUMAN_RESOURCE,
    USER_ROLES.SUPERVISOR,
  ];

  if (adminRoles.includes(role)) {
    return <ADMIN_USER_ROUTES />;
  } else if (role === USER_ROLES.EMPLOYEE || role === USER_ROLES.INTERN) {
    return <EMPLOYEE_USER_ROUTES />;
  } else if (role === USER_ROLES.OWNER) {
    return <OWNER_ROUTES />;
  }

  return <EMPLOYEE_USER_ROUTES />;
});

const App = () => {
  const store = new AppStore();
  const api = new AppApi(store);
  const ui = new UiStore();

  return (
    <div className="app">
      <AppContext.Provider value={{ store, api, ui }}>
        <Suspense fallback={<LoadingEllipsis />}>
          <MainRoutes />
        </Suspense>
        <SnackbarManager />
      </AppContext.Provider>
    </div>
  );
};
export default App;
