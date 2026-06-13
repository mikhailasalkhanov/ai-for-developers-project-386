<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'

const route = useRoute()
const isAdmin = route.path.startsWith('/admin')
</script>

<template>
  <header class="border-b">
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <RouterLink to="/" class="text-xl font-bold tracking-tight"> CalComClone </RouterLink>
      <nav>
        <Button v-if="!isAdmin" variant="ghost" as-child>
          <RouterLink to="/admin"> Admin </RouterLink>
        </Button>
        <Button v-else variant="ghost" as-child>
          <RouterLink to="/"> Public site </RouterLink>
        </Button>
      </nav>
    </div>
  </header>
</template>
