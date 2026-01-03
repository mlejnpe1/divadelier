import { useState } from "react";
import Logo from "../assets/images/logos/logo.webp";
import {
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  UserRoundPen,
  User2,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (err) {
      console.error("Chyba při odhlášení: ", err);
    }
  };

  const menuItems = [
    {
      title: "Domovská scéna",
      submenu: [
        { label: "Divadlo Di", href: "https://divadlodi.cz" },
        { label: "Dr. ZDIV", href: "/drZdiv" },
        { label: "Divan", href: "/divan" },
        { label: "VVV", href: "/vvv" },
        { label: "TV VV", href: "/tvvv" },
      ],
    },
    {
      title: "Program & Nabídka",
      submenu: [
        { label: "Akce", href: "/akce" },
        { label: "Kurzy", href: "/kurzy" },
        { label: "E-shop", href: "/eshop" },
      ],
    },
    {
      title: "O Divadeliéru",
      submenu: [
        { label: "Historie", href: "/historie" },
        { label: "Pronájem", href: "/pronajem" },
        { label: "Kontakt", href: "/kontakt" },
      ],
    },
  ];

  const UserMenu = () => {
    if (loading) return null;

    if (!user) {
      return (
        <a href='/login'>
          <div className='px-4 py-3 flex justify-end'>
            <UserRoundPen className='w-6 h-6 text-gray-700 hover:text-[#f5a623] cursor-pointer' />
          </div>
        </a>
      );
    }

    return (
      <div className='flex items-center justify-end space-x-2 px-4 py-3'>
        <span className='text-gray-700 font-medium'>
          {console.log(user)}
          {user.first_name} {user.second_name}
        </span>
        <button onClick={handleLogout} className='focus:outline-none'>
          <LogOut className='w-6 h-6 text-gray-700 hover:text-[#f5a623] cursor-pointer' />
        </button>
      </div>
    );
  };

  return (
    <nav className='bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex-shrink-0 flex items-center'>
            <a href='/'>
              <img src={Logo} alt='Logo' className='h-12 w-auto' />
            </a>
          </div>

          <div className='hidden md:flex space-x-6 items-center'>
            {menuItems.map((item) => (
              <div key={item.title} className='relative'>
                <button
                  onClick={() => toggleDropdown(item.title)}
                  className='flex items-center space-x-1 text-gray-800 hover:text-[#f5a623] font-medium'
                >
                  <span>{item.title}</span>
                  {openDropdown === item.title ? (
                    <ChevronUp className='w-4 h-4' />
                  ) : (
                    <ChevronDown className='w-4 h-4' />
                  )}
                </button>
                {openDropdown === item.title && (
                  <div className='absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg animate-fadeIn'>
                    {item.submenu.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        className='block px-4 py-2 text-gray-700 hover:bg-[#f5a623] hover:text-white rounded-lg'
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <UserMenu />
          </div>

          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className='text-gray-800 hover:text-[#f5a623]'
            >
              {mobileOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className='md:hidden bg-white border-t border-gray-200 shadow-md animate-fadeIn'>
          {menuItems.map((item) => (
            <div key={item.title} className='border-b border-gray-100'>
              <button
                onClick={() => toggleDropdown(item.title)}
                className='w-full flex justify-between items-center px-4 py-3 text-gray-800 hover:bg-gray-50 font-medium'
              >
                {item.title}
                {openDropdown === item.title ? (
                  <ChevronUp className='w-4 h-4' />
                ) : (
                  <ChevronDown className='w-4 h-4' />
                )}
              </button>
              {openDropdown === item.title && (
                <div className='px-6 pb-2'>
                  {item.submenu.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className='block py-2 text-gray-700 hover:text-[#f5a623]'
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <UserMenu />
        </div>
      )}
    </nav>
  );
}
