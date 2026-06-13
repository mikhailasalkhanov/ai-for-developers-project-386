<script setup lang="ts">
import type { Booking } from '@/api/types'
import { formatDateTime } from '@/lib/datetime'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

defineProps<{
  bookings: Booking[]
  loading: boolean
}>()
</script>

<template>
  <div class="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Guest Name</TableHead>
          <TableHead>Event Type</TableHead>
          <TableHead>Date / Time</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="loading">
          <TableRow v-for="i in 5" :key="i">
            <TableCell v-for="j in 4" :key="j">
              <Skeleton class="h-4 w-full" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="bookings.length === 0">
          <TableRow>
            <TableCell colspan="4" class="text-center text-muted-foreground py-8">
              No upcoming bookings.
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow v-for="booking in bookings" :key="booking.id">
            <TableCell class="font-medium">{{ booking.guest.name }}</TableCell>
            <TableCell>{{ booking.eventTypeName }}</TableCell>
            <TableCell>{{ formatDateTime(booking.startTime) }}</TableCell>
            <TableCell>{{ formatDateTime(booking.createdAt) }}</TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
