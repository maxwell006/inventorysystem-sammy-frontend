import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { getAllProducts } from "../../../services/productService";
import { useAuth } from "../../../context/AuthContext";

interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    expiryDate: string;
    image?: string;
}

export default function ExpiredProducts() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { token } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExpiredProducts = async () => {
        try {
            if (!token) return;

            const result = await getAllProducts(token);
            const allProducts: Product[] = Array.isArray(result.products)
                ? result.products
                : [];

            const today = new Date();

           
            const expired = allProducts.filter((p) => {
                if (!p.expiryDate) return false;
                const exp = new Date(p.expiryDate);
                return exp < today;
            });

           
            expired.sort(
                (a, b) =>
                    new Date(a.expiryDate).getTime() -
                    new Date(b.expiryDate).getTime()
            );

            setProducts(expired);
        } catch (err) {
            console.error("Failed to fetch expired products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpiredProducts();
    }, [token]);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell className="px-5 py-3 font-medium">
                                    Product
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium">
                                    Quantity
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium">
                                    Date Expired
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium">
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading ? (
                                <TableRow>
                                    <TableCell className="px-5 py-4" colSpan={4}>
                                        Loading expired products...
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell className="px-5 py-4" colSpan={4}>
                                        No expired products
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        product.image
                                                            ? `${API_BASE_URL}/uploads/${product.image}`
                                                            : "/images/product/placeholder.jpg"
                                                    }
                                                    className="w-10 h-10 rounded-md object-cover"
                                                    alt={product.name}
                                                />
                                                <span className="font-medium">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-5 py-4">
                                            {product.quantity}
                                        </TableCell>

                                        <TableCell className="px-5 py-4">
                                            {new Date(
                                                product.expiryDate
                                            ).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell className="px-5 py-4 font-medium text-red-600">
                                            Expired
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Footer */}
                    <p className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                        Total Expired Products:{" "}
                        <span className="font-medium text-red-600">
                            {products.length}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
