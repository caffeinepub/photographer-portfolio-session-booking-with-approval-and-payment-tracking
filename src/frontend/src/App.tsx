import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import AdminRoute from "./components/auth/AdminRoute";
import AppLayout from "./components/layout/AppLayout";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BookingPage from "./pages/BookingPage";
import ClientAlbumsPage from "./pages/ClientAlbumsPage";
import ContactPage from "./pages/ContactPage";
import AlbumManagerPage from "./pages/Dashboard/AlbumManagerPage";
import BookingDetailPage from "./pages/Dashboard/BookingDetailPage";
import BookingsListPage from "./pages/Dashboard/BookingsListPage";
import DashboardHomePage from "./pages/Dashboard/DashboardHomePage";
import PortfolioManagerPage from "./pages/Dashboard/PortfolioManagerPage";
import LandingPage from "./pages/LandingPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import PortfolioGalleryPage from "./pages/PortfolioGalleryPage";

function ScrollToTop() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ScrollToTop />
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster />
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portfolio",
  component: PortfolioGalleryPage,
});

const portfolioDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portfolio/$id",
  component: PortfolioDetailPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book",
  component: BookingPage,
});

const bookingConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book/confirmation",
  component: BookingConfirmationPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const photosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/photos",
  component: ClientAlbumsPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AdminRoute>
      <DashboardHomePage />
    </AdminRoute>
  ),
});

const dashboardBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/bookings",
  component: () => (
    <AdminRoute>
      <BookingsListPage />
    </AdminRoute>
  ),
});

const dashboardBookingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/bookings/$id",
  component: () => (
    <AdminRoute>
      <BookingDetailPage />
    </AdminRoute>
  ),
});

const dashboardPortfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/portfolio",
  component: () => (
    <AdminRoute>
      <PortfolioManagerPage />
    </AdminRoute>
  ),
});

const dashboardAlbumsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/albums",
  component: () => (
    <AdminRoute>
      <AlbumManagerPage />
    </AdminRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  portfolioRoute,
  portfolioDetailRoute,
  bookingRoute,
  bookingConfirmationRoute,
  contactRoute,
  photosRoute,
  dashboardRoute,
  dashboardBookingsRoute,
  dashboardBookingDetailRoute,
  dashboardPortfolioRoute,
  dashboardAlbumsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
