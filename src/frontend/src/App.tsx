import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import LandingPage from './pages/LandingPage';
import PortfolioGalleryPage from './pages/PortfolioGalleryPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import DashboardHomePage from './pages/Dashboard/DashboardHomePage';
import BookingsListPage from './pages/Dashboard/BookingsListPage';
import BookingDetailPage from './pages/Dashboard/BookingDetailPage';
import PortfolioManagerPage from './pages/Dashboard/PortfolioManagerPage';
import AppLayout from './components/layout/AppLayout';
import AdminRoute from './components/auth/AdminRoute';

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster />
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolio',
  component: PortfolioGalleryPage,
});

const portfolioDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolio/$id',
  component: PortfolioDetailPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book',
  component: BookingPage,
});

const bookingConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book/confirmation',
  component: BookingConfirmationPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AdminRoute>
      <DashboardHomePage />
    </AdminRoute>
  ),
});

const dashboardBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/bookings',
  component: () => (
    <AdminRoute>
      <BookingsListPage />
    </AdminRoute>
  ),
});

const dashboardBookingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/bookings/$id',
  component: () => (
    <AdminRoute>
      <BookingDetailPage />
    </AdminRoute>
  ),
});

const dashboardPortfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/portfolio',
  component: () => (
    <AdminRoute>
      <PortfolioManagerPage />
    </AdminRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  portfolioRoute,
  portfolioDetailRoute,
  bookingRoute,
  bookingConfirmationRoute,
  dashboardRoute,
  dashboardBookingsRoute,
  dashboardBookingDetailRoute,
  dashboardPortfolioRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
