import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useState<{ id: string; name: string; email: string; phone?: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setForm({ name: parsed.name, email: parsed.email, password: "" });
    }
  }, []);

  const handleSave = async () => {
    try {
      if (!user) return;

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/admin/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.id,
          name: form.name,
          email: form.email,
          ...(form.password ? { password: form.password } : {}), 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      // Update localStorage and state
      const updatedUser = { ...user, name: form.name, email: form.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert("Profile updated successfully!");
      closeModal();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.name}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 lg:inline-flex lg:w-auto"
        >
          Edit
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>
          <div className="flex flex-col gap-4">
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Leave blank to keep current password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button size="sm" variant="outline" onClick={closeModal}>Close</Button>
              <Button size="sm" onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
