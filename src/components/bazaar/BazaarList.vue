<template>
  <div class="space-y-2">
    <div v-for="item in items" :key="item.id"
      class="card flex items-center justify-between">
      <div class="flex-1">
        <p class="font-medium text-gray-800">{{ item.description }}</p>
        <p class="text-xs text-gray-500">{{ banglaDate(item.date) }}</p>
      </div>
      <div class="text-right">
        <p class="font-bold text-teal-700">৳{{ item.amount }}</p>
        <button v-if="isAdmin" @click="$emit('delete', item.id)"
          class="text-xs text-red-400 hover:text-red-600">মুছুন</button>
      </div>
    </div>
    <div v-if="!items.length" class="text-center py-8 text-gray-400">
      <p class="text-3xl mb-2">🛒</p>
      <p>এই মাসে কোনো বাজার এন্ট্রি নেই</p>
    </div>
  </div>
</template>

<script setup>
import { banglaDate } from '../../utils/helpers'
defineProps({ items: Array, isAdmin: Boolean })
defineEmits(['delete'])
</script>
