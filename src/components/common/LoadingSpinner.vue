<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
    <p class="mt-3 text-gray-500 text-sm">{{ text }}</p>
  </div>
</template>
<script setup>
defineProps({ text: { type: String, default: 'লোড হচ্ছে...' } })
</script>
