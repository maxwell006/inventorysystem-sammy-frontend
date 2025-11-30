import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useEffect, useState } from "react";
import { getMonthlySales } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function MonthlySalesChart() {
  const { token } = useAuth();

  const [sales, setSales] = useState<number[]>(Array(12).fill(0));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchSales() {
      try {
        const data = await getMonthlySales(token!);
        setSales(data.totals);
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    }

    fetchSales();
  }, [token]);

  // Export table PDF
  async function exportPDFReport() {
    const pdf = new jsPDF("p", "mm", "a4");

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const totalYearSales = sales.reduce((a, b) => a + b, 0);

    // Title
    pdf.setFontSize(18);
    pdf.text("Monthly Sales Report", 14, 15);

    pdf.setFontSize(12);
    pdf.text(`Year: ${new Date().getFullYear()}`, 14, 25);
    pdf.text(`Total Sales: ₦${totalYearSales.toLocaleString()}`, 14, 32);

    const tableData = months.map((month, i) => [
      month,
      `₦${sales[i].toLocaleString()}`
    ]);

    autoTable(pdf, {
      startY: 40,
      head: [["Month", "Total Sales"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [60, 90, 255] },
      styles: { fontSize: 11 },
    });

    pdf.save("monthly_sales_report.pdf");
  }

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: { type: "bar", height: 180, toolbar: { show: true } },
    plotOptions: { bar: { horizontal: false, columnWidth: "100%", borderRadius: 2 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    },
    fill: { opacity: 0.9 },
    tooltip: { y: { formatter: (val: number) => `₦${val.toLocaleString()}` } },
  };

  const series = [{ name: "Sales", data: sales }];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>

        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>

          <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
            <DropdownItem
              className="font-normal"
              onItemClick={() => {
                setIsOpen(false);
                exportPDFReport();
              }}
            >
              Export as PDF
            </DropdownItem>
            
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
