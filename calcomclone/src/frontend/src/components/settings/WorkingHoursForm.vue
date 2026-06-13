<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import type { OwnerSettings, DaySchedule, TimeOfDay } from '@/api/types'
import { useSettingsStore } from '@/stores/settings'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

const store = useSettingsStore()

const DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

type DayKey = (typeof DAY_KEYS)[number]

const dayLabels: Record<DayKey, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

const timezone = reactive({ value: '' })

const days = reactive<
  Record<DayKey, { isWorking: boolean; startH: number; startM: number; endH: number; endM: number }>
>(
  Object.fromEntries(
    DAY_KEYS.map((k) => [k, { isWorking: true, startH: 9, startM: 0, endH: 17, endM: 0 }]),
  ) as Record<
    DayKey,
    { isWorking: boolean; startH: number; startM: number; endH: number; endM: number }
  >,
)

function loadFromStore() {
  const s = store.settings
  timezone.value = s.timezone
  for (const key of DAY_KEYS) {
    const day = s.workingHours[key]
    days[key] = {
      isWorking: day.isWorking,
      startH: day.start.hour,
      startM: day.start.minute,
      endH: day.end.hour,
      endM: day.end.minute,
    }
  }
}

onMounted(async () => {
  await store.fetch()
  if (store.error === null) loadFromStore()
})

function buildSettings(): OwnerSettings {
  const makeTime = (h: number, m: number): TimeOfDay => ({ hour: h, minute: m })
  const makeDay = (d: (typeof days)[DayKey]): DaySchedule => ({
    isWorking: d.isWorking,
    start: makeTime(d.startH, d.startM),
    end: makeTime(d.endH, d.endM),
  })

  return {
    timezone: timezone.value,
    workingHours: {
      monday: makeDay(days.monday),
      tuesday: makeDay(days.tuesday),
      wednesday: makeDay(days.wednesday),
      thursday: makeDay(days.thursday),
      friday: makeDay(days.friday),
      saturday: makeDay(days.saturday),
      sunday: makeDay(days.sunday),
    },
  }
}

const saving = reactive({ value: false })

async function handleSave() {
  saving.value = true
  await store.save(buildSettings())
  saving.value = false
}
</script>

<template>
  <div v-if="store.loading" class="space-y-4">
    <Skeleton class="h-8 w-48" />
    <Skeleton v-for="i in 7" :key="i" class="h-16 w-full" />
  </div>

  <div v-else class="space-y-6">
    <div v-if="store.error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
      {{ store.error }}
    </div>

    <div class="grid gap-2 max-w-xs">
      <Label for="timezone">Timezone</Label>
      <Input id="timezone" v-model="timezone.value" placeholder="UTC" />
    </div>

    <div class="space-y-3">
      <h3 class="text-lg font-semibold">Working Hours</h3>
      <div
        v-for="key in DAY_KEYS"
        :key="key"
        class="flex flex-wrap items-center gap-3 rounded-md border p-3"
      >
        <div class="flex items-center gap-2 min-w-28">
          <Checkbox
            :id="`day-${key}`"
            :model-value="(days[key] as { isWorking: boolean }).isWorking"
            @update:model-value="
              (v: boolean) => {
                ;(days[key] as { isWorking: boolean }).isWorking = v
              }
            "
          />
          <Label :for="`day-${key}`" class="font-medium">{{ dayLabels[key] }}</Label>
        </div>
        <template v-if="(days[key] as { isWorking: boolean }).isWorking">
          <div class="flex items-center gap-1">
            <Input
              :model-value="String((days[key] as { startH: number }).startH)"
              @update:model-value="
                (v: string) => {
                  ;(days[key] as { startH: number }).startH = Number(v)
                }
              "
              type="number"
              min="0"
              max="23"
              class="w-16"
            />
            <span>:</span>
            <Input
              :model-value="String((days[key] as { startM: number }).startM)"
              @update:model-value="
                (v: string) => {
                  ;(days[key] as { startM: number }).startM = Number(v)
                }
              "
              type="number"
              min="0"
              max="59"
              class="w-16"
            />
            <span class="mx-1 text-muted-foreground">-</span>
            <Input
              :model-value="String((days[key] as { endH: number }).endH)"
              @update:model-value="
                (v: string) => {
                  ;(days[key] as { endH: number }).endH = Number(v)
                }
              "
              type="number"
              min="0"
              max="23"
              class="w-16"
            />
            <span>:</span>
            <Input
              :model-value="String((days[key] as { endM: number }).endM)"
              @update:model-value="
                (v: string) => {
                  ;(days[key] as { endM: number }).endM = Number(v)
                }
              "
              type="number"
              min="0"
              max="59"
              class="w-16"
            />
          </div>
        </template>
      </div>
    </div>

    <Button @click="handleSave" :disabled="saving.value">
      {{ saving.value ? 'Saving...' : 'Save Settings' }}
    </Button>
  </div>
</template>
