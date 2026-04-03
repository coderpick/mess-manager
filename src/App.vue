<template>
  <div class="min-h-screen bg-gray-50" v-if="!authStore.loading">
    <Navbar v-if="showChrome" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <BottomNav v-if="showChrome" />
  </div>
  <LoadingSpinner v-else text="অ্যাপ লোড হচ্ছে..." />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import { useMessStore } from './stores/messStore'
import Navbar from './components/common/Navbar.vue'
import BottomNav from './components/common/BottomNav.vue'
import LoadingSpinner from './components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const messStore = useMessStore()
const route = useRoute()

const showChrome = computed(() => {
  const noChrome = ['Landing', 'Login', 'Setup']
  return authStore.user && authStore.userProfile?.messId && !noChrome.includes(route.name)
})

onMounted(async () => {
  await authStore.init()
  if (authStore.userProfile?.messId) {
    try {
      await messStore.loadMess(authStore.userProfile.messId)
    } catch (e) {
      console.error('Mess load error:', e)
    }
  }
})
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
