import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

interface OrderProductItem {
    productId: {
        _id: string;
        name: string;
        price: number;
        expiryDate: string;
        image?: string;
    };
    quantity: number;
    total: number;
}

interface Order {
    _id: string;
    customer: string;
    totalPrice: number;
    createdAt: string;
    products: OrderProductItem[];
}

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export default function Orders() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { token } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState<SortOption>("newest");

    const fetchOrders = async () => {
        if (!token) return;

        try {
            const res = await axios.get(`${API_BASE_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const sortedOrders = [...orders].sort((a, b) => {
        switch (sortOption) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "highest":
                return b.totalPrice - a.totalPrice;
            case "lowest":
                return a.totalPrice - b.totalPrice;
            default:
                return 0;
        }
    });

    // Summary
    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const totalOrders = orders.length;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-5 space-y-4">

            {/* Summary Cards */}
            <div className="flex flex-wrap gap-4 justify-between">
                <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-200 font-medium">Total Orders</p>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                </div>

                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-200 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Sorting */}
            <div className="flex gap-2 flex-wrap">
                {["newest", "oldest", "highest", "lowest"].map(option => (
                    <button
                        key={option}
                        className={`px-3 py-1 rounded ${
                            sortOption === option
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                        onClick={() => setSortOption(option as SortOption)}
                    >
                        {option === "newest"
                            ? "Newest"
                            : option === "oldest"
                                ? "Oldest"
                                : option === "highest"
                                    ? "Highest Value"
                                    : "Lowest Value"}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <Table className="min-w-full table-auto">
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell className="px-5 py-3 font-medium">Order ID</TableCell>
                            <TableCell className="px-5 py-3 font-medium">Customer</TableCell>
                            <TableCell className="px-5 py-3 font-medium">Items</TableCell>
                            <TableCell className="px-5 py-3 font-medium">Total</TableCell>
                            <TableCell className="px-5 py-3 font-medium">Date</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="px-5 py-4 text-center">
                                    Loading orders...
                                </TableCell>
                            </TableRow>
                        ) : sortedOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="px-5 py-4 text-center">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedOrders.map(order => (
                                <TableRow key={order._id}>
                                    <TableCell className="px-5 py-4 font-medium">
                                        {order._id.slice(-6).toUpperCase()}
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        {order.customer}
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        <div className="flex flex-col gap-2">
                                            {order.products.map((item, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            item.productId.image
                                                                ? `${API_BASE_URL}/uploads/${item.productId.image}`
                                                                : "/images/product/placeholder.jpg"
                                                        }
                                                        className="w-8 h-8 rounded object-cover"
                                                    />
                                                    <span>
                                                        {item.productId.name} (x{item.quantity})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-5 py-4 font-semibold">
                                        ₦{order.totalPrice.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
