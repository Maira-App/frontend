import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Activity,
  Calendar,
  Users,
  FileText,
  CreditCard,
  Settings,
  Mic,
} from "lucide-react";

const navigationItems = [
  {
    title: "Activity",
    url: createPageUrl("Dashboard"),
    icon: Activity,
    description: "Recent actions",
  },
  {
    title: "Voice",
    url: createPageUrl("Voice"),
    icon: Mic,
    description: "Voice assistant",
  },
  {
    title: "Calendar",
    url: createPageUrl("Calendar"),
    icon: Calendar,
    description: "Schedule & events",
  },
  {
    title: "Clients",
    url: createPageUrl("Clients"),
    icon: Users,
    description: "Client management",
  },
  {
    title: "Summaries",
    url: createPageUrl("Summaries"),
    icon: FileText,
    description: "Insights & reports",
  },
  {
    title: "Billing",
    url: createPageUrl("Billing"),
    icon: CreditCard,
    description: "Subscription & payments",
  },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-800 bg-black px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MAIRA</h1>
              <p className="text-xs text-gray-400">Real Estate Assistant</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <li key={item.title}>
                        <Link
                          to={item.url}
                          className={`
                            group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 transition-all duration-200
                            ${
                              isActive
                                ? "bg-gray-900 text-cyan-400 shadow-lg shadow-cyan-500/10"
                                : "text-gray-300 hover:text-white hover:bg-gray-900"
                            }
                          `}
                        >
                          <item.icon
                            className={`h-5 w-5 shrink-0 ${
                              isActive
                                ? "text-cyan-400"
                                : "text-gray-400 group-hover:text-white"
                            }`}
                          />
                          <div>
                            <div>{item.title}</div>
                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>

          {/* Settings */}
          <div className="mt-auto">
            <Link
              to="#"
              className="group -mx-2 flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 text-gray-300 hover:bg-gray-900 hover:text-white"
            >
              <Settings className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-white" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-gray-800 safe-area-bottom">
          <div className="grid grid-cols-6 h-20 px-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`
                    flex flex-col items-center justify-center gap-1 transition-colors duration-200 rounded-lg mx-1 my-2 min-h-[44px]
                    ${
                      isActive
                        ? "text-cyan-400 bg-gray-900/50"
                        : "text-gray-500 hover:text-gray-300"
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs font-medium leading-tight">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="pb-24 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
