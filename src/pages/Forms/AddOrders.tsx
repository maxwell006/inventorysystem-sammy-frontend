import { useState, useEffect, useRef } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import MultiSelect from "../../components/form/MultiSelect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddOrders() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [products, setProducts] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const receiptRef = useRef<HTMLDivElement>(null);

    // Fetch all products
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`);
                const data = await res.json();
                const mappedProducts = Array.isArray(data.products) ? data.products : [];
                setProducts(mappedProducts);
            } catch (err) {
                toast.error("Failed to load products");
            }
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        const updatedQuantities: { [key: string]: number } = { ...quantities };
        selectedProducts.forEach((p) => {
            if (p._id && !updatedQuantities[p._id]) {
                updatedQuantities[p._id] = 1;
            }
        });
        setQuantities(updatedQuantities);
    }, [selectedProducts]);

    const totalAmount = selectedProducts.reduce((sum, prod) => {
        const qty = quantities[prod._id] || 0;
        return sum + prod.price * qty;
    }, 0);

    // Print receipt
    const handlePrintReceipt = () => {
        if (!receiptRef.current) return;
        const printContents = receiptRef.current.innerHTML;
        const newWindow = window.open("", "", "width=500,height=600");
        if (!newWindow) return;

        newWindow.document.write(`
            <html>
                <head>
                    <title>Receipt</title>
                    <style>
                        body { font-family: monospace; font-size: 12px; width: 280px; }
                        .logo { text-align: center; margin-bottom: 10px; }
                        .line { border-bottom: 1px dashed #000; margin: 5px 0; }
                        .total { font-weight: bold; margin-top: 5px; }
                        .thankyou { text-align: center; margin-top: 10px; }
                    </style>
                </head>
                <body>
                    ${printContents}
                </body>
            </html>
        `);
        newWindow.document.close();
        newWindow.focus();
        newWindow.print();
        newWindow.close();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerName) {
            return toast.error("Enter customer name & phone");
        }

        if (!selectedProducts.length) {
            return toast.error("Select at least one product");
        }

        const finalItems = selectedProducts.map(p => ({
            productId: p._id,
            quantity: quantities[p._id] || 1
        }));

        const payload = {
            customer: customerName,
            items: finalItems
        };

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to add order");

            toast.success("Order added successfully!");

            // Print receipt
            handlePrintReceipt();

            // Reset form
            setCustomerName("");
            
            setSelectedProducts([]);
            setQuantities({});
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const multiSelectOptions = products.map(p => ({
        value: p._id,
        text: p.name
    }));

    return (
        <div>
            <PageMeta title="Add Order | Pharmaceutical Dashboard" description="" />
            <PageBreadcrumb pageTitle="Add Order" />
            <ToastContainer />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* LEFT SIDE */}
                <div className="space-y-6">
                    <div>
                        <Label>Customer Name</Label>
                        <Input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Enter customer name"
                        />
                    </div>

                    

                    <div>
                        <Label>Select Products</Label>
                        <MultiSelect
                            options={multiSelectOptions}
                            value={selectedProducts.map(p => p._id)}
                            onChange={(selectedIds) => {
                                const selected = products.filter(p => selectedIds.includes(p._id));
                                setSelectedProducts(selected);
                            }}
                        />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-6">
                    {selectedProducts.map((product) => (
                        <div key={product._id} className="p-4 rounded-lg border dark:border-gray-700">
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-xs text-gray-500">₦{product.price.toLocaleString()}</p>

                            <div className="mt-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={quantities[product._id] || 1}
                                    onChange={(e) =>
                                        setQuantities({ ...quantities, [product._id]: Number(e.target.value) })
                                    }
                                    placeholder="Enter quantity"
                                />
                            </div>
                        </div>
                    ))}

                    <div className="text-lg font-semibold">
                        Total: ₦{totalAmount.toLocaleString()}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700"
                    >
                        {loading ? "Saving..." : "Add Order"}
                    </button>
                </div>
            </form>

            
            <div ref={receiptRef} style={{ display: "none" }}>
                <div className="logo">
                    <img src="/favicon.png" alt="Sammy Logo" width="100" />
                    <h2>Sammy Pharmacy</h2>
                </div>
                <div className="line"></div>
                <p><strong>Customer:</strong> {customerName}</p>
               
                <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
                <div className="line"></div>
                {selectedProducts.map((p) => (
                    <p key={p._id}>
                        {p.name} x {quantities[p._id] || 1} - ₦{((p.price || 0) * (quantities[p._id] || 1)).toLocaleString()}
                    </p>
                ))}
                <div className="line"></div>
                <p className="total">Total: ₦{totalAmount.toLocaleString()}</p>
                <div className="thankyou">
                    <p>Thank you for choosing Sammy's Pharmacy!</p>
                </div>
            </div>
        </div>
    );
}
