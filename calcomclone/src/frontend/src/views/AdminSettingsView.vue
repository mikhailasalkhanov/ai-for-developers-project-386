<script setup lang="ts">
import WorkingHoursForm from '@/components/settings/WorkingHoursForm.vue'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
      <p class="text-muted-foreground">Configure working hours and timezone.</p>
    </div>

    <WorkingHoursForm />
  </div>
</template>
