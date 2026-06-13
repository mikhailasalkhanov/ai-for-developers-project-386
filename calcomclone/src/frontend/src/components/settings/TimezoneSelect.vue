<script setup lang="ts">
import { computed } from 'vue'
import { getTimeZones } from '@vvo/tzdb'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const timeZones = getTimeZones({ includeUtc: true })

function formatOffset(rawOffset: number): string {
  const sign = rawOffset >= 0 ? '+' : '-'
  const abs = Math.abs(rawOffset)
  const hours = Math.floor(abs / 60)
  const minutes = abs % 60
  return `GMT${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const groupedZones = computed(() => {
  const groups = new Map<string, { label: string; zones: typeof timeZones }>()
  for (const tz of timeZones) {
    const continent = tz.name.split('/')[0] ?? 'Other'
    if (!groups.has(continent)) groups.set(continent, { label: continent, zones: [] })
    groups.get(continent)!.zones.push(tz)
  }
  return [...groups.values()]
})

function tzLabel(tz: (typeof timeZones)[number]): string {
  return `${formatOffset(tz.currentTimeOffsetInMinutes)} ${tz.name.replace(/_/g, ' ')}${tz.mainCities.length ? ` (${tz.mainCities.join(', ')})` : ''}`
}
</script>

<template>
  <Select :model-value="modelValue" @update:model-value="(v) => emit('update:modelValue', v as string)">
    <SelectTrigger class="w-full max-w-xs">
      <SelectValue placeholder="Select timezone..." />
    </SelectTrigger>
    <SelectContent class="max-h-72">
      <SelectGroup v-for="group in groupedZones" :key="group.label">
        <SelectItem
          v-for="tz in group.zones"
          :key="tz.name"
          :value="tz.name"
        >
          {{ tzLabel(tz) }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>