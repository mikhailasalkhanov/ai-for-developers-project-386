<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Slot } from '@/api/types'
import { formatDayHeader, formatTime, isToday, getNext14Days, isSameDay } from '@/lib/datetime'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps<{
  slots: Slot[]
  loading: boolean
}>()

const days = getNext14Days()
const selectedDate = ref<Date>(days[0]!)

const selectedSlot = defineModel<Slot | null>({ required: false, default: null })

const slotsByDate = computed(() => {
  const map: Record<string, Slot[]> = {}
  for (const slot of props.slots) {
    for (const day of days) {
      if (isSameDay(slot.startTime, day.toISOString())) {
        const key = day.toISOString().split('T')[0]!
        if (!map[key]) map[key] = []
        map[key].push(slot)
        break
      }
    }
  }
  for (const day of days) {
    const key = day.toISOString().split('T')[0]!
    if (!map[key]) map[key] = []
  }
  return map
})

const selectedDaySlots = computed(() => {
  const key = selectedDate.value.toISOString().split('T')[0]!
  return slotsByDate.value[key] ?? []
})

function selectDate(day: Date) {
  selectedDate.value = day
  selectedSlot.value = null
}

function selectSlot(slot: Slot) {
  selectedSlot.value = slot
}

const selectedKey = computed(() => selectedDate.value.toISOString().split('T')[0]!)

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
  <div class="space-y-4">
    <div class="flex gap-2 overflow-x-auto pb-2">
      <Button
        v-for="day in days"
        :key="day.toISOString()"
        :variant="selectedKey === day.toISOString().split('T')[0] ? 'default' : 'outline'"
        size="sm"
        class="flex-shrink-0"
        @click="selectDate(day)"
      >
        <span class="flex flex-col items-center text-xs">
          <span class="font-medium">{{ formatDayHeader(day) }}</span>
          <span v-if="isToday(day)" class="text-inherit opacity-70">Today</span>
        </span>
      </Button>
    </div>

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
