<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Slot, DaySchedule } from '@/api/types'
import { formatTime, isSameDay } from '@/lib/datetime'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { getLocalTimeZone, today } from '@internationalized/date'
import type { DateValue } from 'reka-ui'

const props = defineProps<{
  slots: Slot[]
  loading: boolean
  workingDays: Record<string, DaySchedule>
}>()

const selectedSlot = defineModel<Slot | null>({ required: false, default: null })

const minDate = today(getLocalTimeZone())
const maxAllowed = minDate.add({ days: 13 })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedDate = ref(minDate) as any

const DAY_NAMES: Record<number, string> = {
  0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
  4: 'thursday', 5: 'friday', 6: 'saturday',
}

function isDateDisabled(date: DateValue): boolean {
  if (date.compare(minDate) < 0) return true
  if (date.compare(maxAllowed) > 0) return true
  const jsDate = new Date(date.year, date.month - 1, date.day)
  const dayKey = DAY_NAMES[jsDate.getDay()]
  if (dayKey === undefined) return true
  return !props.workingDays[dayKey]?.isWorking
}

function dateKey(d: DateValue): string {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
}

const slotsByDate = computed(() => {
  const set = new Set<string>()
  for (const slot of props.slots) {
    for (let i = 0; i < 14; i++) {
      const d = minDate.add({ days: i })
      const dStr = new Date(d.year, d.month - 1, d.day).toISOString()
      if (isSameDay(slot.startTime, dStr)) {
        set.add(dateKey(d))
        break
      }
    }
  }
  return set
})

const selectedDaySlots = computed(() => {
  const d = selectedDate.value
  return props.slots.filter((s) =>
    isSameDay(s.startTime, new Date(d.year, d.month - 1, d.day).toISOString()),
  )
})

function selectSlot(slot: Slot) {
  selectedSlot.value = slot
}

watch(
  () => props.slots,
  () => {
    if (!selectedSlot.value) return
    const stillExists = props.slots.some((s) => s.startTime === selectedSlot.value?.startTime)
    if (!stillExists) selectedSlot.value = null
  },
)
</script>

<template>
  <div class="space-y-6">
    <Calendar
      v-model="selectedDate"
      :is-date-disabled="isDateDisabled"
      class="rounded-md border"
    >

      <template #cell-indicator="{ date }">
        <span
          v-if="slotsByDate.has(dateKey(date))"
          class="mx-auto mt-0.5 block size-1.5 rounded-full bg-green-500"
        />
      </template>
    </Calendar>

    <div v-if="loading" class="space-y-2">
      <Skeleton v-for="i in 4" :key="i" class="h-10 w-full" />
    </div>

    <div v-else-if="selectedDaySlots.length === 0" class="py-8 text-center text-muted-foreground">
      No available slots for this day.
    </div>

    <div v-else class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      <Button
        v-for="slot in selectedDaySlots"
        :key="slot.startTime"
        :variant="selectedSlot?.startTime === slot.startTime ? 'default' : 'outline'"
        size="sm"
        @click="selectSlot(slot)"
      >
        {{ formatTime(slot.startTime) }}
      </Button>
    </div>
  </div>
</template>
