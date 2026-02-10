import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import {
  Bell,
  Menu,
  X,
  Database,
  Map,
  Github,
  Linkedin,
  MessageSquare,
} from "lucide-react";
import logo from "../assets/Shoplift Studio Logo.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { overdueFollowUps, setOpenLeadId } = useNotifications(); // ✅ add
  const count = overdueFollowUps.length;
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // ✅ add inside Navbar component

  // Add this after your other useStates in Navbar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification-bell")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    {
      id: "google-maps",
      label: "Google Maps",
      icon: Map,
      path: "/google-maps",
    },
    {
      id: "shopify",
      label: "Shopify Directory",
      icon: Database,
      path: "/shopify-directory",
    },
    {
      id: "messageFormat",
      label: "Message Format",
      icon: MessageSquare,
      path: "/message-format",
    },
  ];

  return (
    <nav className="bg-[#22323c] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <div className="bg-white p-2 rounded-lg shadow-md">
              <Database className="h-6 w-6 text-indigo-600" />
            </div> */}
            {/* <span className="text-white font-bold text-xl hidden sm:block"> */}
            <img src={logo} alt="Shoplift Studio Logo" className="h-8" />
            {/* </span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Section - Social Links */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <div className="relative notification-bell">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <Bell className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {count}
                  </span>
                )}
              </button>

              {showDropdown && count > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                  <div className="p-3 border-b bg-red-50 rounded-t-xl">
                    <p className="font-bold text-red-700">
                      ⚠️ {count} Overdue Follow-up{count > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {overdueFollowUps.map((item, i) => (
                      <div
                        key={i}
                        className="p-3 border-b hover:bg-red-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setOpenLeadId(item.leadId); // ✅ tell the page which lead to open
                          navigate("/google-maps");
                          setShowDropdown(false);
                        }}
                      >
                        <p className="font-medium text-gray-900 text-sm">
                          {item.leadName}
                        </p>
                        <p className="text-xs text-red-600">
                          {item.label} is overdue!
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-white text-indigo-600"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
