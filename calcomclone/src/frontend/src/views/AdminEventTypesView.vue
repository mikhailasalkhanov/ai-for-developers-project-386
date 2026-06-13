<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { EventType, EventTypeCreate, EventTypeUpdate } from '@/api/types'
import { useEventTypeStore } from '@/stores/event-types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import EventTypeForm from '@/components/event-types/EventTypeForm.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const store = useEventTypeStore()

const formOpen = ref(false)
const editingEventType = ref<EventType | null>(null)
const deleteTarget = ref<EventType | null>(null)

onMounted(() => {
  store.fetchAdmin()
})

function openCreate() {
  editingEventType.value = null
  formOpen.value = true
}

function openEdit(id: string) {
  const found = store.eventTypes.find((et) => et.id === id) ?? null
  editingEventType.value = found
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editingEventType.value = null
}

async function handleSave(data: EventTypeCreate) {
  if (editingEventType.value) {
    await store.update(editingEventType.value.id, data as EventTypeUpdate)
  } else {
    await store.create(data)
  }
  closeForm()
}

function confirmDelete(eventType: EventType) {
  deleteTarget.value = eventType
}

async function handleDelete() {
  if (deleteTarget.value) {
    await store.remove(deleteTarget.value.id)
    deleteTarget.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Event Types</h1>
        <p class="text-muted-foreground">Create and manage your event types.</p>
      </div>
      <Button @click="openCreate"> Create Event Type </Button>
    </div>

    <div v-if="store.error" class="rounded-md bg-destructive/10 p-4 text-destructive">
      {{ store.error }}
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead class="w-28">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="store.loading">
            <TableRow v-for="i in 5" :key="i">
              <TableCell v-for="j in 4" :key="j">
                <Skeleton class="h-4 w-full" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else-if="store.eventTypes.length === 0">
            <TableRow>
              <TableCell colspan="4" class="text-center text-muted-foreground py-8">
                No event types yet. Create your first one!
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow v-for="et in store.eventTypes" :key="et.id">
              <TableCell class="font-medium">{{ et.name }}</TableCell>
              <TableCell class="text-muted-foreground">{{ et.description }}</TableCell>
              <TableCell> {{ et.durationMinutes }} min </TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" @click="openEdit(et.id)"> Edit </Button>
                  <Button variant="destructive" size="sm" @click="confirmDelete(et)">
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <EventTypeForm
      :open="formOpen"
      :event-type="editingEventType"
      :loading="store.loading"
      @close="closeForm"
      @save="handleSave"
    />

    <Dialog :open="!!deleteTarget" @update:open="deleteTarget = null">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Event Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{{ deleteTarget?.name }}"? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteTarget = null"> Cancel </Button>
          <Button variant="destructive" @click="handleDelete" :disabled="store.loading">
            {{ store.loading ? 'Deleting...' : 'Delete' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
