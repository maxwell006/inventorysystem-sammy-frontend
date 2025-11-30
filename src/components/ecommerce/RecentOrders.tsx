import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface OrderProduct {
  _id: string;
  name: string;
  variants?: string;
  category: string;
  price: number;
}

interface Order {
  _id: string;
  customer: string;
  createdAt: string;
  products: {
    productId: OrderProduct;
    quantity: number;
    total: number;
  }[];
  totalPrice: number;
}

// Format date
function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
  });
}

// FORMAT ORDER ID using the real _id
function formatOrderId(mongoId: string) {
  return `#ORD-${mongoId.slice(-6).toUpperCase()}`;
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { token } = useAuth();

  useEffect(() => {
    async function fetchOrders() {
      try {
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/orders/recent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [token]);

  if (loading) return <p>Loading recent orders...</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Sales
        </h3>

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          See all
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell className="font-semibold">Order Id</TableCell>
              <TableCell className="font-semibold">Item(s)</TableCell>
              <TableCell className="font-semibold">Customer</TableCell>
              <TableCell className="font-semibold">Time</TableCell>
              <TableCell className="font-semibold">Price</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.length === 0 && (
              <TableRow>
                <TableCell className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No recent orders
                </TableCell>
              </TableRow>
            )}

            {orders.map((order) => (
              <TableRow key={order._id} className="align-middle">
                <TableCell className="py-3 font-medium text-gray-800 dark:text-white/90 whitespace-nowrap">
                  {formatOrderId(order._id)}
                </TableCell>

                <TableCell className="py-3 pr-4 text-gray-500 dark:text-gray-400 max-w-[180px]">
                  <div
                    className="truncate"
                    title={order.products
                      .map((p) => `${p.productId.name} (${p.quantity})`)
                      .join(", ")}
                  >
                    {order.products
                      .map((p) => `${p.productId.name} (${p.quantity})`)
                      .join(", ")}
                  </div>
                </TableCell>

                <TableCell className="py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {order.customer}
                </TableCell>

                <TableCell className="py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDateTime(order.createdAt)}
                </TableCell>

                <TableCell className="py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  ₦{order.totalPrice.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
