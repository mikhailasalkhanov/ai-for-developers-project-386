import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { OwnerSettings } from '@/api/types'
import * as api from '@/api/settings'

const defaultWorkingDay = () => ({
  isWorking: true,
  start: { hour: 9, minute: 0 },
  end: { hour: 17, minute: 0 },
})

const defaultSettings = (): OwnerSettings => ({
  timezone: 'UTC',
  workingHours: {
    monday: defaultWorkingDay(),
    tuesday: defaultWorkingDay(),
    wednesday: defaultWorkingDay(),
    thursday: defaultWorkingDay(),
    friday: defaultWorkingDay(),
    saturday: { isWorking: false, start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
    sunday: { isWorking: false, start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
})

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<OwnerSettings>(defaultSettings())
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      const data = await api.getOwnerSettings()
      settings.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load settings'
    } finally {
      loading.value = false
    }
  }

  async function save(data: OwnerSettings): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const updated = await api.updateOwnerSettings(data)
      settings.value = updated
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save settings'
      return false
    } finally {
      loading.value = false
    }
  }

  return { settings, loading, error, fetch, save }
})
