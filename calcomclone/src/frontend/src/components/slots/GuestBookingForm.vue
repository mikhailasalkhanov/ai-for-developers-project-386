<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Slot } from '@/api/types'
import { formatDate, formatTime } from '@/lib/datetime'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  selectedSlot: Slot | null
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'book', guestName: string): void
}>()

const guestName = ref('')

const canBook = computed(
  () => !!props.selectedSlot && guestName.value.trim().length > 0 && !props.loading,
)

function handleBook() {
  if (!canBook.value) return
  emit('book', guestName.value.trim())
}
</script>

<template>
  <div class="space-y-4 rounded-lg border p-6">
    <h3 class="text-lg font-semibold">Confirm your booking</h3>

    <div v-if="selectedSlot" class="rounded-md bg-muted p-3">
      <p class="text-sm font-medium">{{ formatDate(selectedSlot.startTime) }}</p>
      <p class="text-sm text-muted-foreground">
        {{ formatTime(selectedSlot.startTime) }} - {{ formatTime(selectedSlot.endTime) }}
      </p>
    </div>
    <div v-else class="rounded-md bg-muted p-3 text-sm text-muted-foreground">
      Select a time slot above to book.
    </div>

    <div class="grid gap-2">
      <Label for="guest-name">Your name</Label>
      <Input
        id="guest-name"
        v-model="guestName"
        placeholder="Enter your name"
        :disabled="loading"
      />
    </div>

    <Button class="w-full" :disabled="!canBook" @click="handleBook">
      {{ loading ? 'Booking...' : 'Confirm Booking' }}
    </Button>
  </div>
</template>
