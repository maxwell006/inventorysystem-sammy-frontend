import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import BarChart from "./pages/Charts/BarChart";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./context/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProducts from "./pages/Forms/AddProducts";
import ProductTable from "./pages/Tables/ProductTable";
import ExpiringSoon from "./components/tables/BasicTables/ExpiringSoon";
import ExpiredProducts from "./components/tables/BasicTables/Expired";
import Orders from "./components/tables/BasicTables/Orders";
import AddOrders from "./pages/Forms/AddOrders";
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Protected dashboard routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="profile" element={<UserProfiles />} />
          {/* PRoducts */}
          <Route path="add-products" element={<AddProducts />} />
          <Route path="products" element={<ProductTable />} />
          <Route path="products-expiring" element={<ExpiringSoon />} />
          <Route path="expired-products" element={<ExpiredProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="add-orders" element={<AddOrders />} />

          <Route path="bar-chart" element={<BarChart />} />
        </Route>

        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        style={{ zIndex: 20000 }}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
