<script setup lang="ts">
import { ref, watch } from 'vue'
import type { EventType, EventTypeCreate } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps<{
  open: boolean
  eventType?: EventType | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: EventTypeCreate): void
}>()

const name = ref('')
const description = ref('')
const durationMinutes = ref(30)
const nameError = ref('')
const durationError = ref('')

watch(
  () => props.open,
  (val) => {
    if (val) {
      if (props.eventType) {
        name.value = props.eventType.name
        description.value = props.eventType.description
        durationMinutes.value = props.eventType.durationMinutes
      } else {
        name.value = ''
        description.value = ''
        durationMinutes.value = 30
      }
      nameError.value = ''
      durationError.value = ''
    }
  },
)

function handleSave() {
  let valid = true
  if (!name.value.trim()) {
    nameError.value = 'Name is required'
    valid = false
  }
  if (isNaN(durationMinutes.value) || durationMinutes.value <= 0) {
    durationError.value = 'Duration must be greater than 0'
    valid = false
  }
  if (!valid) return

  emit('save', {
    name: name.value.trim(),
    description: description.value.trim(),
    durationMinutes: durationMinutes.value,
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('close')">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ eventType ? 'Edit Event Type' : 'Create Event Type' }}
        </DialogTitle>
        <DialogDescription>
          {{
            eventType
              ? 'Update the event type details.'
              : 'Fill in the details for the new event type.'
          }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="et-name">Name</Label>
          <Input id="et-name" v-model="name" placeholder="Meeting name" />
          <p v-if="nameError" class="text-sm text-destructive">{{ nameError }}</p>
        </div>
        <div class="grid gap-2">
          <Label for="et-desc">Description</Label>
          <Textarea id="et-desc" v-model="description" placeholder="Brief description" />
        </div>
        <div class="grid gap-2">
          <Label for="et-duration">Duration (minutes)</Label>
          <Input id="et-duration" v-model.number="durationMinutes" type="number" min="1" />
          <p v-if="durationError" class="text-sm text-destructive">{{ durationError }}</p>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="emit('close')" :disabled="loading"> Cancel </Button>
        <Button @click="handleSave" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
