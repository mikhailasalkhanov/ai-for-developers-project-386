<script setup lang="ts">
import type { EventType } from '@/api/types'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

defineProps<{
  eventType: EventType
  mode: 'guest' | 'admin'
}>()

defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ eventType.name }}</CardTitle>
      <CardDescription>{{ eventType.description }}</CardDescription>
    </CardHeader>
    <CardContent>
      <Badge variant="secondary"> {{ eventType.durationMinutes }} min </Badge>
    </CardContent>
    <CardFooter class="flex gap-2">
      <Button v-if="mode === 'guest'" as-child>
        <RouterLink :to="`/book/${eventType.id}`"> Book </RouterLink>
      </Button>
      <template v-if="mode === 'admin'">
        <Button variant="outline" @click="$emit('edit', eventType.id)"> Edit </Button>
        <Button variant="destructive" @click="$emit('delete', eventType.id)"> Delete </Button>
      </template>
    </CardFooter>
  </Card>
</template>
