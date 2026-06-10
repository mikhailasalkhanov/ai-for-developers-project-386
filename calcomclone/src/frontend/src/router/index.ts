import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'public-event-types',
      component: () => import('@/views/PublicEventTypesView.vue'),
    },
    {
      path: '/book/:eventTypeId',
      name: 'public-booking',
      component: () => import('@/views/PublicBookingView.vue'),
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardView.vue'),
    },
    {
      path: '/admin/event-types',
      name: 'admin-event-types',
      component: () => import('@/views/AdminEventTypesView.vue'),
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('@/views/AdminBookingsView.vue'),
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('@/views/AdminSettingsView.vue'),
    },
  ],
})

export default router
