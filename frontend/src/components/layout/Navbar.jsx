import { useState } from "react";
import Logo from "../../assets/images/logos/logo.webp";
import {
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  UserRoundPen,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = (menu) => {
    if (openDropdown === menu) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(menu);
    }
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const isExternalLink = (href) => {
    return href.startsWith("http");
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      closeMobileMenu();
      navigate("/login");
    } catch (err) {
      console.error("Chyba při odhlášení: ", err);
    }
  };

  const menuItems = [
    {
      title: "Domovská scéna",
      submenu: [
        {
          label: "Divadlo DI",
          href: "https://divadlodi.cz",
          target: "_blank",
          rel: "noopener noreferrer",
        },
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

  const UserMenu = ({ mobile = false }) => {
    if (loading) {
      return null;
    }

    if (!user) {
      if (mobile) {
        return (
          <Link
            to="/login"
            onClick={closeMobileMenu}
            className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/50 px-4 py-4 text-sm font-medium text-gray-800 transition hover:bg-white/70"
          >
            <span>Přihlášení</span>
            <UserRoundPen className="h-5 w-5 text-[#f5a623]" />
          </Link>
        );
      }

      return (
        <a href="/login" className="flex items-center justify-end">
          <UserRoundPen className="h-5 w-5 text-gray-700 transition hover:text-[#f5a623]" />
        </a>
      );
    }

    if (mobile) {
      return (
        <div className="rounded-3xl border border-white/20 bg-white/50 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                Přihlášen
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {user.first_name} {user.second_name}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
              <UserRoundPen className="h-5 w-5 text-[#c98512]" />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f5a623] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e19812]"
          >
            <LogOut className="h-4 w-4" />
            Odhlásit se
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm font-medium text-gray-800">
          {user.first_name} {user.second_name}
        </span>
        <button
          onClick={handleLogout}
          className="rounded-full p-2 text-gray-700 transition hover:bg-white/50 hover:text-[#f5a623]"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex shrink-0 items-center">
              <a href="/" className="flex items-center">
                <img src={Logo} alt="Logo" className="h-12 w-auto" />
              </a>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {menuItems.map((item) => {
                const isOpen = openDropdown === item.title;

                return (
                  <div
                    key={item.title}
                    className="relative"
                    onMouseEnter={() => {
                      setOpenDropdown(item.title);
                    }}
                    onMouseLeave={() => {
                      setOpenDropdown(null);
                    }}
                  >
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                        isOpen
                          ? "text-[#c98512]"
                          : "text-gray-800 hover:text-[#f5a623]"
                      }`}
                    >
                      <span>{item.title}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {isOpen && (
                      <>
                        <div className="absolute left-0 top-full h-3 w-full" />

                        <div className="absolute left-0 top-full w-56 overflow-hidden rounded-2xl border border-white/30 bg-white/75 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.14)] backdrop-blur-xl">
                          {item.submenu.map((sub) => {
                            if (isExternalLink(sub.href)) {
                              return (
                                <a
                                  key={sub.label}
                                  href={sub.href}
                                  target={sub.target}
                                  rel={sub.rel}
                                  className="block rounded-xl px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#f5a623] hover:text-white"
                                >
                                  {sub.label}
                                </a>
                              );
                            }

                            return (
                              <Link
                                key={sub.label}
                                to={sub.href}
                                className="block rounded-xl px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#f5a623] hover:text-white"
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              <div className="ml-3">
                <UserMenu />
              </div>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="rounded-full p-2 text-gray-800 transition hover:bg-white/50 hover:text-[#f5a623]"
                aria-label={mobileOpen ? "Zavřít menu" : "Otevřít menu"}
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Zavřít mobilní menu"
            onClick={closeMobileMenu}
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] md:hidden"
          />

          <div className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto px-2 pb-2 md:hidden">
            <div className="overflow-hidden rounded-[2rem] border border-white/25 bg-white/75 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
              <div className="border-b border-white/20 px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-500">
                  Menu
                </p>
              </div>

              <div className="space-y-3 p-4">
                {menuItems.map((item) => {
                  const isOpen = openDropdown === item.title;

                  return (
                    <div
                      key={item.title}
                      className="overflow-hidden rounded-3xl border border-white/20 bg-white/45"
                    >
                      <button
                        onClick={() => toggleDropdown(item.title)}
                        className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
                          isOpen ? "bg-white/35" : "hover:bg-white/35"
                        }`}
                      >
                        <div>
                          <p className="text-base font-semibold text-gray-800">
                            {item.title}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/65">
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-[#c98512]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-white/15 px-3 pb-3 pt-2">
                          <div className="space-y-1">
                            {item.submenu.map((sub) => {
                              const itemClassName =
                                "flex items-center rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#f5a623] hover:text-white";

                              if (isExternalLink(sub.href)) {
                                return (
                                  <a
                                    key={sub.label}
                                    href={sub.href}
                                    target={sub.target}
                                    rel={sub.rel}
                                    onClick={closeMobileMenu}
                                    className={itemClassName}
                                  >
                                    {sub.label}
                                  </a>
                                );
                              }

                              return (
                                <Link
                                  key={sub.label}
                                  to={sub.href}
                                  onClick={closeMobileMenu}
                                  className={itemClassName}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <UserMenu mobile />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
