import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { getAllProducts } from "../../services/productService";
import { getAllOrders } from "../../services/orderService";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
  DollarLineIcon,
} from "../../icons";

import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  const { token } = useAuth();

  const [productCount, setProductCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [expiredProducts, setExpiredProducts] = useState(0);
  const [dailySales, setDailySales] = useState(0);
  const [dailyOrders, setDailyOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Fetch all products
        const productsResult = await getAllProducts(token!);
        const allProducts = Array.isArray(productsResult)
          ? productsResult
          : Array.isArray(productsResult.products)
            ? productsResult.products
            : [];
        setProductCount(allProducts.length);

        const now = new Date();
        const expiredCount = allProducts.filter(
          (p) => p.expiryDate && new Date(p.expiryDate) < now
        ).length;
        setExpiredProducts(expiredCount);

        // Fetch all orders
        const ordersResult = await getAllOrders(token!);
        const allOrders = Array.isArray(ordersResult)
          ? ordersResult
          : Array.isArray(ordersResult.orders)
            ? ordersResult.orders
            : [];
        setTotalOrders(allOrders.length);

        const totalSalesSum = allOrders.reduce(
          (acc, order) => acc + (order.totalPrice || 0),
          0
        );
        setTotalSales(totalSalesSum);

        // Fetch daily sales
        const dailySalesRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/daily-sales`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dailyData = await dailySalesRes.json();
        setDailySales(dailyData.totalSales || 0);
        setDailyOrders(dailyData.totalOrders || 0);


      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [token]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">

      {/* All Products */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              All Products
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : productCount}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
          </Badge>
        </div>
      </div>

      {/* Total Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : totalOrders}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
          </Badge>
        </div>
      </div>  

      {/* Total Sales */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Sales
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : `₦${totalSales.toLocaleString()}`}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
          </Badge>
        </div>
      </div>

      {/* Daily Sales */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Daily Sales
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : `₦${dailySales.toLocaleString()}`}
            </h4>
          </div>
          <Badge color="info">
            <ArrowUpIcon />
          </Badge>
        </div>
      </div>

      {/* Expired Products */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Expired Products
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : expiredProducts}
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon />
          </Badge>
        </div>
      </div>

    </div>
  );
}
