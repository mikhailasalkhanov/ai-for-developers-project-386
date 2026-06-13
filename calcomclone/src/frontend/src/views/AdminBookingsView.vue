<script setup lang="ts">
import { onMounted } from 'vue'
import { useBookingStore } from '@/stores/bookings'
import BookingList from '@/components/bookings/BookingList.vue'

const store = useBookingStore()

onMounted(() => {
  store.fetch()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Bookings</h1>
      <p class="text-muted-foreground">View all upcoming bookings.</p>
    </div>

    <div v-if="store.error" class="rounded-md bg-destructive/10 p-4 text-destructive">
      {{ store.error }}
    </div>

    <BookingList :bookings="store.bookings" :loading="store.loading" />
  </div>
</template>
