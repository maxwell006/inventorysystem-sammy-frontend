import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { getAllProducts } from "../../services/productService";

interface ExpiringProduct {
  name: string;
  expiryDate: string;
  status: "1 month" | "7 days" | "3 days" | "expired";
}

export default function NotificationDropdown() {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [expiringProducts, setExpiringProducts] = useState<ExpiringProduct[]>([]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  useEffect(() => {
  async function fetchExpiringProducts() {
    if (!token) return;

    try {
      const response = await getAllProducts(token);
      const products = Array.isArray(response) ? response : response.products;

      if (!Array.isArray(products)) {
        console.error("Products is not an array:", products);
        return;
      }

      const now = new Date();

      const notifications: ExpiringProduct[] = products
        .filter((p: any) => p.expiryDate)
        .map((p: any) => {
          const expiry = new Date(p.expiryDate);
          const diffTime = expiry.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let status: ExpiringProduct["status"] | null = null;
          if (diffDays > 0 && diffDays <= 3) status = "3 days";
          else if (diffDays > 3 && diffDays <= 7) status = "7 days";
          else if (diffDays > 7 && diffDays <= 30) status = "1 month";
          else if (diffDays <= 0) status = "expired";

          return status ? { name: p.name, expiryDate: p.expiryDate, status } : null;
        })
        .filter(Boolean) as ExpiringProduct[];

      setExpiringProducts(notifications);
    } catch (error) {
      console.error("Error fetching expiring products:", error);
    }
  }

  fetchExpiringProducts();
}, [token]);


  const getStatusColor = (status: ExpiringProduct["status"]) => {
    switch (status) {
      case "1 month":
        return "bg-yellow-400";
      case "7 days":
        return "bg-orange-400";
      case "3 days":
        return "bg-red-400";
      case "expired":
        return "bg-gray-700";
    }
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${!notifying ? "hidden" : "flex"
            }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0 max-h-[480px] overflow-y-auto"
      >

        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Expiring Products
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {expiringProducts.length === 0 ? (
            <li className="p-4 text-gray-500 text-center">No products expiring soon</li>
          ) : (
            expiringProducts.map((p, idx) => (
              <li key={idx}>
                <DropdownItem
                  onItemClick={closeDropdown}
                  className="flex justify-between gap-3 rounded-lg border-b border-gray-100 p-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
                  <span className="font-medium text-gray-800 dark:text-white/90">{p.name}</span>
                  <span className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-white text-xs ${getStatusColor(p.status)}`}>
                      {p.status.toUpperCase()}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {new Date(p.expiryDate).toLocaleDateString()}
                    </span>
                  </span>
                </DropdownItem>
              </li>
            ))
          )}
        </ul>
      </Dropdown>
    </div>
  );
}
