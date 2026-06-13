<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useEventTypeStore } from '@/stores/event-types'
import { useBookingStore } from '@/stores/bookings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const eventTypeStore = useEventTypeStore()
const bookingStore = useBookingStore()

onMounted(() => {
  eventTypeStore.fetchAdmin()
  bookingStore.fetch()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p class="text-muted-foreground">Manage your calendar and event types.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink to="/admin/event-types">
        <Card class="hover:bg-muted/50 transition-colors">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="eventTypeStore.loading">
              <Skeleton class="h-8 w-16" />
            </div>
            <div v-else class="text-2xl font-bold">
              {{ eventTypeStore.eventTypes.length }}
            </div>
          </CardContent>
        </Card>
      </RouterLink>

      <RouterLink to="/admin/bookings">
        <Card class="hover:bg-muted/50 transition-colors">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="bookingStore.loading">
              <Skeleton class="h-8 w-16" />
            </div>
            <div v-else class="text-2xl font-bold">
              {{ bookingStore.bookings.length }}
            </div>
          </CardContent>
        </Card>
      </RouterLink>

      <RouterLink to="/admin/settings">
        <Card class="hover:bg-muted/50 transition-colors">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-sm text-muted-foreground">Working hours & timezone</div>
          </CardContent>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>
