import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
// import Select from "../../components/form/Select";
import FileInputExample from "../../components/form/form-elements/FileInputExample";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProducts() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [name, setName] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [quantity, setQuantity] = useState<number | "">("");
    const [expiryDate, setExpiryDate] = useState(""); 
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !price || !quantity || !expiryDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price.toString());
        formData.append("quantity", quantity.toString());
        formData.append("expiryDate", expiryDate);
        if (image) formData.append("image", image);

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/products`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to add product");

            toast.success("Product added successfully!");
            // Reset form
            setName("");
            setPrice("");
            setQuantity("");
            setExpiryDate("");
            setImage(null);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageMeta
                title="Add Product | Pharmaceutical Dashboard"
                description="Add new products to your inventory"
            />
            <PageBreadcrumb pageTitle="Add Product" />
            <ToastContainer position="top-right" autoClose={3000} />

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-6 xl:grid-cols-2"
            >
                <div className="space-y-6">
                    <div>
                        <Label>Product Name</Label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                        />
                    </div>

                    <div>
                        <Label>Price</Label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            placeholder="Enter product price"
                        />
                    </div>

                    <div>
                        <Label>Quantity</Label>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            placeholder="Enter quantity"
                        />
                    </div>

                    <div>
                        <Label>Expiry Date</Label>
                        <Input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <Label>Product Image</Label>
                        <FileInputExample
                            onFileSelect={(file: File) => setImage(file)}
                        />


                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
