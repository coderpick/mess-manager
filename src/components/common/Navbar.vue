<template>
  <header class="bg-teal-600 text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🍽️</span>
        <div>
          <h1 class="font-bold text-lg leading-tight">
            {{ messStore.mess?.name || 'মেস ম্যানেজার' }}
          </h1>
          <p v-if="messStore.mess" class="text-teal-100 text-xs">
            {{ banglaMonthYear(messStore.selectedMonth) }}
          </p>
        </div>
      </div>
      <router-link to="/profile" class="w-9 h-9 rounded-full bg-teal-500 
        flex items-center justify-center overflow-hidden border-2 border-teal-300">
        <img v-if="authStore.user?.photoURL"
          :src="authStore.user.photoURL" class="w-full h-full object-cover" />
        <span v-else class="text-sm font-bold">
          {{ authStore.userProfile?.name?.charAt(0) || '?' }}
        </span>
      </router-link>
    </div>
  </header>
</template>
<script setup>
import { useAuthStore } from '../../stores/authStore'
import { useMessStore } from '../../stores/messStore'
import { banglaMonthYear } from '../../utils/helpers'
const authStore = useAuthStore()
const messStore = useMessStore()
</script>
