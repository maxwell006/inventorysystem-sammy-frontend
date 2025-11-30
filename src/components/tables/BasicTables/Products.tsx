import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { getAllProducts, deleteProduct, updateProduct } from "../../../services/productService";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";

interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    expiryDate: string;
    image?: string;
}

type SortOption = "alphabetical" | "newest" | "oldest" | "lowStock";

export default function Products() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { token } = useAuth();
    const { isOpen, openModal, closeModal } = useModal();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState<SortOption>("alphabetical");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        if (!token) return;
        try {
            const result = await getAllProducts(token);
            setProducts(Array.isArray(result.products) ? result.products : []);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [token]);

    // Sorting
    const sortedProducts = [...products].sort((a, b) => {
        switch (sortOption) {
            case "alphabetical":
                return a.name.localeCompare(b.name);
            case "newest":
                return new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime();
            case "oldest":
                return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
            case "lowStock":
                return a.quantity - b.quantity;
            default:
                return 0;
        }
    });

    const handleEdit = (product: Product) => {
        // Make a copy to avoid mutating state directly
        setEditingProduct({ ...product });
        openModal();
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct || !token) return;
        try {
            await updateProduct(editingProduct._id, token, editingProduct);
            // Update products array using the local editingProduct
            setProducts(prev =>
                prev.map(p => (p._id === editingProduct._id ? { ...editingProduct } : p))
            );
            closeModal();
        } catch (err) {
            console.error("Failed to update product:", err);
        }
    };


    const handleDelete = async (id: string) => {
        if (!token) return;
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id, token);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error("Failed to delete product:", err);
        }
    };

    // Inventory totals
    const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0);
    const totalValue = products.reduce((acc, p) => acc + p.quantity * p.price, 0);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-5 space-y-4">
            {/* Inventory Overview */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-full sm:w-auto">
                    <p className="text-gray-700 dark:text-gray-200 font-medium">Total Units</p>
                    <p className="text-2xl font-bold">{totalUnits}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-full sm:w-auto">
                    <p className="text-gray-700 dark:text-gray-200 font-medium">Total Inventory Value</p>
                    <p className="text-2xl font-bold">₦{totalValue.toLocaleString()}</p>
                </div>
            </div>

            {/* Sorting Buttons */}
            <div className="flex gap-2 flex-wrap">
                {["alphabetical", "newest", "oldest", "lowStock"].map(option => (
                    <button
                        key={option}
                        className={`px-3 py-1 rounded ${sortOption === option
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                        onClick={() => setSortOption(option as SortOption)}
                    >
                        {option === "alphabetical"
                            ? "A → Z"
                            : option === "newest"
                                ? "Newest"
                                : option === "oldest"
                                    ? "Oldest"
                                    : "Low Stock"}
                    </button>
                ))}
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
                <Table className="min-w-full table-auto">
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell className="px-5 py-3 font-medium">Product</TableCell>
                            <TableCell className="px-5 py-3 font-medium">Price</TableCell>
                            <TableCell className="px-5 py-3 font-medium">Quantity</TableCell>
                            <TableCell className="px-5 py-3 font-medium">Expiry Date</TableCell>
                            <TableCell className="px-5 py-3 font-medium">Actions</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="px-5 py-4 text-center">
                                    Loading products...
                                </TableCell>
                            </TableRow>
                        ) : sortedProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="px-5 py-4 text-center">
                                    No products found
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedProducts.map(product => (
                                <TableRow key={product._id}>
                                    <TableCell className="px-5 py-4 flex items-center gap-3">
                                        <img
                                            src={
                                                product.image
                                                    ? `${API_BASE_URL}/uploads/${product.image}`
                                                    : "/images/product/placeholder.jpg"
                                            }
                                            className="w-10 h-10 rounded-md object-cover"
                                            alt={product.name}
                                        />
                                        <span className="font-medium">{product.name}</span>
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        ₦{product.price.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        <span
                                            className={`font-semibold ${product.quantity <= 5
                                                    ? "text-red-500"
                                                    : "text-gray-700 dark:text-gray-200"
                                                }`}
                                        >
                                            {product.quantity}
                                        </span>
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        {new Date(product.expiryDate).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell className="px-5 py-4 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
                {editingProduct && (
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
                            Edit Product
                        </h3>
                        <div className="flex flex-col gap-3">
                            <label>
                                Name:
                                <input
                                    className="border p-2 rounded w-full"
                                    type="text"
                                    value={editingProduct.name}
                                    onChange={e =>
                                        setEditingProduct({ ...editingProduct, name: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Price:
                                <input
                                    className="border p-2 rounded w-full"
                                    type="number"
                                    value={editingProduct.price}
                                    onChange={e =>
                                        setEditingProduct({ ...editingProduct, price: +e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Quantity:
                                <input
                                    className="border p-2 rounded w-full"
                                    type="number"
                                    value={editingProduct.quantity}
                                    onChange={e =>
                                        setEditingProduct({ ...editingProduct, quantity: +e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Expiry Date:
                                <input
                                    className="border p-2 rounded w-full"
                                    type="date"
                                    value={editingProduct.expiryDate.split("T")[0]}
                                    onChange={e =>
                                        setEditingProduct({ ...editingProduct, expiryDate: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Image URL:
                                <input
                                    className="border p-2 rounded w-full"
                                    type="text"
                                    value={editingProduct.image || ""}
                                    onChange={e =>
                                        setEditingProduct({ ...editingProduct, image: e.target.value })
                                    }
                                />
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleUpdateProduct}>
                                Save
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
