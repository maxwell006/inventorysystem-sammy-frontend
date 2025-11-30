import { useState, useEffect } from "react";

export default function UserMetaCard() {
  const [user, setUser] = useState<{ name: string; email: string; } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return null;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <img src="./images/user/user.jpg" alt="user" />
          </div>
          <div className="order-3 xl:order-2 text-center xl:text-left">
            <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              {user.name}
            </h4>
           
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
