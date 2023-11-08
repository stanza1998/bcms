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
import PrivateRoute from "./logged_in_admin/shared/PrivateRoute";
import "../src/shared/sass/styles.scss";
import AppearanceSettings from "./logged_in_admin/team/Appearence/AppearenceSettings";
import { Documents } from "./logged_in_admin/bcms/documents/Documents";
import { Accounting } from "./logged_in_admin/bcms/accounting/overview/Accounting";
import { Communication } from "./logged_in_admin/bcms/communication/Communication";
import { BodyCorperates } from "./logged_in_admin/bcms/bodyCorperates/BodyCorporate/BodyCorperates";
import Owners from "./logged_in_admin/bcms/bodyCorperates/Owners";
import { ViewUnit } from "./logged_in_admin/bcms/bodyCorperates/BodyCorporate/units/ViewUnits";
import { UnitInfor } from "./logged_in_admin/bcms/bodyCorperates/BodyCorporate/units/unit-details/UnitInfo";
import { OwnerAccount } from "./logged_in_admin/bcms/owner-accounts/invoices/OwnerAccounts";
import Settings from "./logged_in_admin/profiles/Settings";
import Departments from "./logged_in_admin/team/departments/Departments";
import Employees from "./logged_in_admin/team/employees/Employees";
import { Meetings } from "./logged_in_admin/bcms/meetings/Meetings";
import { Customer } from "./logged_in_admin/bcms/accounting/stakeholders/customers/Customer";
import { ExpenseTracking } from "./logged_in_admin/bcms/accounting/bank-statements-integration/Integration";
import { OwnerInvoices } from "./logged_in_admin/bcms/owner-accounts/invoices/OwnerInvoices";
import { OwnerViewInvoice } from "./logged_in_admin/bcms/owner-accounts/invoices/OwnerViewInvoice";
import { VerifyInvoice } from "./logged_in_admin/bcms/accounting/invoices/customer-invoices/verify/VerifyInvoice";
import { ViewInvoice } from "./logged_in_admin/bcms/accounting/invoices/customer-invoices/verify/ViewInvoice";
import { UnitDetails } from "./logged_in_admin/bcms/bodyCorperates/BodyCorporate/units/unit-details/UnitDetails";
import { Supplier } from "./logged_in_admin/bcms/Types/suppliers/Supplier";
import { Transfer } from "./logged_in_admin/bcms/Types/transfers/Transfer";
import { AccountType } from "./logged_in_admin/bcms/Types/accounts/Account";
import { Statements } from "./logged_in_admin/bcms/accounting/statements/Statements";
import { CustomerReportsFNB } from "./logged_in_admin/bcms/accounting/reports/customer/CustomerReport";
import { SupplierReportsNEDBANK } from "./logged_in_admin/bcms/accounting/reports/supplier/SupplierReports";
import { CustomerReportNEDBANK } from "./logged_in_admin/bcms/accounting/reports/customer/CustomerReportNEDBANK";
import { CreateSupplierInvoice } from "./logged_in_admin/bcms/accounting/invoices/supplier-invoices/create/CreateInvoice";
import { SupplierReportsFNB } from "./logged_in_admin/bcms/accounting/reports/supplier/SupplierReportFNB";
import { Others } from "./logged_in_admin/team/others/Others";
import Accounts from "./logged_in_admin/bcms/accounting/stakeholders/accounts/Accounts";
import { CopiedInvoices } from "./logged_in_admin/bcms/accounting/invoices/customer-invoices/CopiedInvoicesView";
import { SuppliersView } from "./logged_in_admin/bcms/accounting/stakeholders/suppliers/Suppliers";
import { CopiedInvoicesAcc } from "./logged_in_admin/bcms/accounting/invoices/customer-invoices/CopiedInvoicesAccView";
import Hub from "./logged_in_admin/bcms/accounting/accountants-hub/Hub";
import Categories from "./logged_in_admin/bcms/Types/accounts/categories/Categories";
import { BankingTransactions } from "./logged_in_admin/bcms/accounting/banking-transactions/BankingTransaction";
import { Announcements } from "./logged_in_admin/bcms/communication/announcements/Announcements";
import { PrivateMessage } from "./logged_in_admin/bcms/communication/private-message/PrivateMessage";
import { ContactOverview } from "./logged_in_admin/bcms/communication/contacts-management/ContactsOverview";
import { Pop } from "./logged_in_admin/bcms/owner-accounts/proof-of-payment/pop";
import { OwnerPrivateMessage } from "./logged_in_admin/bcms/owner-accounts/owner-communication/private-message-booard/OwnerPrivateMessage";
import { Maintainance } from "./logged_in_admin/bcms/maintanace/Maintainance";
import { RequestMaintenance } from "./logged_in_admin/bcms/maintanace/request/Request";
import { ServiceProvider } from "./logged_in_admin/bcms/maintanace/service-providers/ServiceProvider";
import { MaintenenceReports } from "./logged_in_admin/bcms/maintanace/reports/Reports";
import { WorkOrder } from "./logged_in_admin/bcms/maintanace/work-order/WorkOrder";
import { ViewFolder } from "./logged_in_admin/bcms/meetings/ViewFolder";

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
          {/* communication */}
          <Route
            path={`communication/com-overview`}
            element={<Communication />}
          />
          <Route path={`communication/notices`} element={<Announcements />} />
          <Route
            path={`communication/private-message`}
            element={<PrivateMessage />}
          />
          <Route
            path={`communication/contact-management`}
            element={<ContactOverview />}
          />
          <Route path={`communication/documents`} element={<Documents />} />
          <Route path={`communication/meetings`} element={<Meetings />} />
          <Route
            path={`/c/communication/meetings/:folderId`}
            element={<ViewFolder />}
          />
          {/* Communication ends here */}
          {/* Meetings  */}
          <Route path={`meetings/meetings-overview`} element={<Meetings />} />
          {/* Meetings  */}
          {/* Maintenance  */}
          <Route
            path={`maintainance/main-overview`}
            element={<Maintainance />}
          />
          <Route
            path={`maintainance/request`}
            element={<RequestMaintenance />}
          />
          <Route
            path={`maintainance/service-providers`}
            element={<ServiceProvider />}
          />
          <Route
            path={`maintainance/reports`}
            element={<MaintenenceReports />}
          />
          <Route
            path={`maintainance/request/:requestId`}
            element={<WorkOrder />}
          />
          {/* Maintenance  */}
          {/* Documents */}
          <Route
            path={`documents/documents-overview`}
            element={<Documents />}
          />
          {/* Accounting and finance */}
          <Route
            path={`accounting/accounting-overview`}
            element={<Accounting />}
          />
          <Route path={`accounting/invoices`} element={<Customer />} />
          <Route
            path={`accounting/supplier-invoices`}
            element={<SuppliersView />}
          />
          <Route
            path={`accounting/supplier-invoices/create`}
            element={<CreateSupplierInvoice />}
          />
          {/* <Route
            path={`accounting/recuring-invoices`}
            element={<RecurringInvoices />}
          /> */}
          <Route path={`accounting/account`} element={<Accounts />} />
          <Route path={`accounting/accountants-hub`} element={<Hub />} />
          <Route
            path={`accounting/expense-tracking`}
            element={<ExpenseTracking />}
          />
          <Route path={`accounting/statements`} element={<Statements />} />
          <Route
            path={`accounting/statements/customer`}
            element={<CustomerReportsFNB />}
          />
          <Route
            path={`accounting/statements/customer-nedbank`}
            element={<CustomerReportNEDBANK />}
          />
          <Route
            path={`accounting/statements/supplier`}
            element={<SupplierReportsNEDBANK />}
          />
          a
          <Route
            path={`accounting/banking`}
            element={<BankingTransactions />}
          />
          <Route
            path={`accounting/statements/supplier-fnb`}
            element={<SupplierReportsFNB />}
          />
          <Route
            path={`/c/accounting/invoices/copiedAcc/:propertyId/:id/:yearId/:invoiceId`}
            element={<CopiedInvoicesAcc />}
          />
          {/* <Route path={`accounting/statements/customer-windhoek`} element={<CustomerReportsFNB />} /> */}
          {/* <Route path={`accounting/statements/account`} element={<Statements />} /> */}
          {/* property */}
          <Route path={`body/transfer`} element={<Transfer />} />
          <Route path={`body/suppliers`} element={<Supplier />} />
          <Route path={`body/accountType`} element={<AccountType />} />
          <Route path={`body/account-categories`} element={<Categories />} />
          {/* Accounting and finance */}
          {/* Properties and units */}
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
            element={<UnitDetails />}
          />
          <Route
            path={`/c/body/body-corperate/copied/:propertyId/:id/:yearId/:invoiceId`}
            element={<CopiedInvoices />}
          />
          <Route
            path={`/c/body/body-corperate/:propertyId/:id/:yearId/:invoiceId`}
            element={<VerifyInvoice />}
          />
          <Route
            path={`/c/body/body-corperate/:propertyId/:id/:yearId/:invoiceId/accounting-view`}
            element={<ViewInvoice />}
          />
          {/* Properties and units */}
          <Route path={`body/owners`} element={<Owners />} />
          <Route path={`admin/employees`} element={<Employees />} />
          <Route path={`admin/departments`} element={<Departments />} />
          <Route path={`admin/appearance`} element={<AppearanceSettings />} />
          <Route path={`admin/others`} element={<Others />} />
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
          <Route path={`finance/invoices-view`} element={<OwnerInvoices />} />
          <Route
            path={`/c/finance/invoices-view/:propertyId/:id/:yearId/:monthId/:invoiceId`}
            element={<OwnerViewInvoice />}
          />
          <Route path={`/c/finance/proof-of-payment`} element={<Pop />}></Route>

          {/* communication */}
          <Route
            path={`communication/com-overview`}
            element={<Communication />}
          />
          <Route
            path={`/c/finance/owner-communication/owner-private-message`}
            element={<OwnerPrivateMessage />}
          />
          <Route
            path={`/c/finance/owner-communication/notices`}
            element={<Announcements />}
          />
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
