import { useState } from "react";
import Logo from "../assets/images/logos/logo.webp";
import { ChevronDown, ChevronUp, Menu, X, UserRoundPen } from "lucide-react";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const menuItems = [
    {
      title: "Domovská scéna",
      submenu: ["Divadlo Di", "Dr. Zdiv", "Divan", "VVV", "TVV"],
    },
    {
      title: "Program & Nabídka",
      submenu: ["Akce", "Kurzy", "E-shop"],
    },
    {
      title: "O Divadeliéru",
      submenu: ["Historie", "Pronájem", "Kontakt"],
    },
  ];

  return (
    <nav className='bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          {/* Logo */}
          <div className='flex-shrink-0 flex items-center'>
            <img src={Logo} alt='Logo' className='h-12 w-auto' />
          </div>

          {/* Desktop menu */}
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
                        key={sub}
                        href='#'
                        className='block px-4 py-2 text-gray-700 hover:bg-[#f5a623] hover:text-white rounded-lg'
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Avatar */}
            <UserRoundPen className='w-6 h-6 text-gray-700 hover:text-[#f5a623] cursor-pointer' />
          </div>

          {/* Mobile menu button */}
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

      {/* Mobile menu */}
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
                      key={sub}
                      href='#'
                      className='block py-2 text-gray-700 hover:text-[#f5a623]'
                    >
                      {sub}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className='px-4 py-3 flex justify-end'>
            <UserRoundPen className='w-6 h-6 text-gray-700 hover:text-[#f5a623] cursor-pointer' />
          </div>
        </div>
      )}
    </nav>
  );
}
