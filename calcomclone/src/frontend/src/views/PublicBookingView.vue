<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Slot, EventType } from '@/api/types'
import { useSlotStore } from '@/stores/slots'
import { useSettingsStore } from '@/stores/settings'
import { getPublicEventType } from '@/api/event-types'
import { formatDateTime } from '@/lib/datetime'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import SlotCalendar from '@/components/slots/SlotCalendar.vue'
import GuestBookingForm from '@/components/slots/GuestBookingForm.vue'

const route = useRoute()
const eventTypeId = route.params.eventTypeId as string
const slotStore = useSlotStore()
const settingsStore = useSettingsStore()

const eventType = ref<EventType | null>(null)
const eventTypeLoading = ref(true)
const eventTypeError = ref('')

const selectedSlot = ref<Slot | null>(null)
const bookingSuccess = ref(false)
const bookedTime = ref('')
const bookError = ref('')

onMounted(async () => {
  try {
    eventType.value = await getPublicEventType(eventTypeId)
  } catch (e) {
    eventTypeError.value = e instanceof Error ? e.message : 'Failed to load event type'
  } finally {
    eventTypeLoading.value = false
  }
  await Promise.all([slotStore.fetch(eventTypeId), settingsStore.fetch()])
})

async function handleBook(guestName: string) {
  if (!selectedSlot.value) return
  bookError.value = ''
  const result = await slotStore.createBooking({
    eventTypeId,
    startTime: selectedSlot.value.startTime,
    guest: { name: guestName },
  })
  if (result) {
    bookingSuccess.value = true
    bookedTime.value = selectedSlot.value.startTime
    selectedSlot.value = null
    await slotStore.fetch(eventTypeId)
  } else {
    bookError.value = slotStore.error ?? 'Booking failed'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="eventTypeLoading" class="space-y-2 max-w-[900px] mx-auto">
      <Skeleton class="h-8 w-64" />
      <Skeleton class="h-4 w-96" />
      <Skeleton class="h-5 w-20" />
    </div>

    <div v-else-if="eventTypeError" class="rounded-md bg-destructive/10 p-4 text-destructive max-w-[900px] mx-auto">
      {{ eventTypeError }}
    </div>

    <div v-else-if="eventType" class="space-y-2 max-w-[900px] mx-auto">
      <h1 class="text-3xl font-bold tracking-tight">{{ eventType.name }}</h1>
      <p class="text-muted-foreground">{{ eventType.description }}</p>
      <Badge variant="secondary">{{ eventType.durationMinutes }} min</Badge>
    </div>

    <div v-if="bookingSuccess" class="rounded-md bg-emerald-50 dark:bg-emerald-950 p-4">
      <p class="font-medium text-emerald-700 dark:text-emerald-300">Booking confirmed!</p>
      <p class="text-sm text-emerald-600 dark:text-emerald-400">
        Your booking has been scheduled for {{ formatDateTime(bookedTime) }}.
      </p>
    </div>

    <div v-if="bookError" class="rounded-md bg-destructive/10 p-4 text-destructive">
      {{ bookError }}
    </div>

    <div class="grid gap-6 lg:grid-cols-3 lg:max-w-[900px] mx-auto">
      <div class="lg:col-span-2">
        <SlotCalendar
          v-model="selectedSlot"
          :slots="slotStore.slots"
          :loading="slotStore.loading && !bookingSuccess"
          :working-days="settingsStore.settings.workingHours"
        />
      </div>
      <div>
        <GuestBookingForm
          :selected-slot="selectedSlot"
          :loading="slotStore.loading"
          @book="handleBook"
        />
      </div>
    </div>
  </div>
</template>
