import { Link } from "react-router-dom";

export default function HOHomePage() {

const userString = localStorage.getItem("currentUser");
  const localuser = JSON.parse(userString);
  const user = {
    name: localuser.name,
    role: localuser.role,
    designation: localuser.status,
    division: localuser.department,
  };

 const url = `http://localhost:7070/sectoralDashboard?name=${encodeURIComponent(
                  user.name
                )}&role=${encodeURIComponent(user.role)}&designation=${encodeURIComponent(
                  user.designation
                )}&division=${encodeURIComponent(user.division)}`;

  const modules = [
    { name: "Revenue Tracking ", path: "/GstRevenueOverview" },
     { name: "Sectoral Analysis", path: "/SectoralDashboard" },
    { name: "Fraud Detection Analytics", path: "/FraudAnalysis" },
    { name: "Taxpayer Overview", path: "/ActiveTaxpayerOverview" },
      { name: "Get Taxpayer Details", path: "/GetTaxpayerDetails" },
     { name: "Non Filers", path: "/nonfilers" },
     
    
    

  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navbar */}
       {/*<header className="bg-gradient-to-r from-teal-800 to-cyan-600 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold">Deloitte.</h1>
          <nav className="space-x-6">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/taxpayer-details" className="hover:underline">Taxpayer Details</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          </nav>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="bg-cyan-50 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800">GST ANALYTICAL TOOL</h2>
        
      </section>

      {/* Modules Section */}
      <section className="py-10 bg-gray-100">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-8">
          {modules.map((module) => (
            <Link
              key={module.name}
              to={module.path}
              className="bg-white shadow-md rounded-lg p-6 text-center font-semibold text-teal-800 hover:bg-teal-50 hover:shadow-lg transition"
            >
              {module.name}
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 px-8 text-center bg-white">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">About GST Analytical Tool</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This tool is designed to support Government in taxpayer monitoring and fraud detection.
        </p>
      </section>
    </div>
  );
}
