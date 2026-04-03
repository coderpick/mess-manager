<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 
    z-50 safe-bottom">
    <div class="max-w-lg mx-auto flex">
      <router-link v-for="item in navItems" :key="item.to" :to="item.to"
        class="flex-1 flex flex-col items-center py-2 text-xs transition-colors"
        :class="$route.path === item.to 
          ? 'text-teal-600 font-semibold' 
          : 'text-gray-400'">
        <span class="text-xl mb-0.5">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>
<script setup>
const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'হোম' },
  { to: '/meals', icon: '🍛', label: 'মিল' },
  { to: '/bazaar', icon: '🛒', label: 'বাজার' },
  { to: '/deposits', icon: '💰', label: 'জমা' },
  { to: '/summary', icon: '📊', label: 'হিসাব' }
]
</script>
