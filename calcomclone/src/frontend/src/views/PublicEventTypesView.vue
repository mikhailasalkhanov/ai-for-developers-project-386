<script setup lang="ts">
import { onMounted } from 'vue'
import { useEventTypeStore } from '@/stores/event-types'
import { Skeleton } from '@/components/ui/skeleton'
import EventTypeCard from '@/components/event-types/EventTypeCard.vue'

const store = useEventTypeStore()

onMounted(() => {
  store.fetchPublic()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Available Event Types</h1>
      <p class="text-muted-foreground">Choose an event type to book a time slot.</p>
    </div>

    <div v-if="store.error" class="rounded-md bg-destructive/10 p-4 text-destructive">
      {{ store.error }}
    </div>

    <div v-if="store.loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton v-for="i in 6" :key="i" class="h-48 w-full rounded-xl" />
    </div>

    <div v-else-if="store.eventTypes.length === 0" class="py-12 text-center text-muted-foreground">
      No event types available yet.
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <EventTypeCard v-for="et in store.eventTypes" :key="et.id" :event-type="et" mode="guest" />
    </div>
  </div>
</template>
