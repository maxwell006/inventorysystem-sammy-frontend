import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import Products from "../../components/ecommerce/Products";


export default function Home() {
  return (
    <>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <Products />
        </div>

        <div className="col-span-12 xl:col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
