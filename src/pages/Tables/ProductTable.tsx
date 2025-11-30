import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Products from "../../components/tables/BasicTables/Products";

export default function BasicTables() {
    return (
        <>
            <PageMeta
                title="Products | Sammy’s Pharmaceutical Dashboard"
                description="Manage user information, addresses, and profile settings in Sammy’s Pharmaceutical Store admin dashboard."
            />
            <PageBreadcrumb pageTitle="All Products" />
            <div className="space-y-6">
                <ComponentCard title="Products">
                    <Products />
                </ComponentCard>
            </div>
        </>
    );
}
