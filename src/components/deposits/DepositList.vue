<template>
  <div class="space-y-2">
    <div v-for="item in items" :key="item.id"
      class="card flex items-center justify-between">
      <div class="flex-1">
        <p class="font-medium text-gray-800">{{ getMemberName(item.userId) }}</p>
        <p class="text-xs text-gray-500">
          {{ banglaDate(item.date) }}
          <span v-if="item.note"> • {{ item.note }}</span>
        </p>
      </div>
      <div class="text-right">
        <p class="font-bold text-green-600">৳{{ item.amount }}</p>
        <div v-if="isAdmin" class="flex items-center justify-end gap-2 mt-1">
          <button @click="$emit('edit', item)"
            class="text-xs font-semibold text-teal-600 hover:text-teal-800 p-1 bg-teal-50 rounded">এডিট</button>
          <button @click="$emit('delete', item.id)"
            class="text-xs font-semibold text-red-500 hover:text-red-700 p-1 bg-red-50 rounded">মুছুন</button>
        </div>
      </div>
    </div>
    <div v-if="!items.length" class="text-center py-8 text-gray-400">
      <p class="text-3xl mb-2">💰</p>
      <p>এই মাসে কোনো জমা নেই</p>
    </div>
  </div>
</template>

<script setup>
import { banglaDate } from '../../utils/helpers'
const props = defineProps({ items: Array, members: Array, isAdmin: Boolean })
defineEmits(['delete', 'edit'])

function getMemberName(uid) {
  return props.members?.find(m => m.id === uid)?.name || 'অজানা'
}
</script>
