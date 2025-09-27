// Central place to map logical page names to route paths.
const pageRouteMap = {
  Dashboard: "/dashboard",
  Calendar: "/calendar",
  Clients: "/clients",
  Summaries: "/summaries",
  Billing: "/billing"
};

export function createPageUrl(pageName) {
  return pageRouteMap[pageName] || "/";
}

// (Optional) export the map if needed elsewhere.
export { pageRouteMap };