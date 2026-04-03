<template>
  <div class="page-container">
    <div class="text-center mb-6">
      <div class="w-24 h-24 rounded-full mx-auto bg-teal-200 overflow-hidden mb-3 
        border-4 border-teal-100">
        <img v-if="authStore.user?.photoURL" :src="authStore.user.photoURL"
          class="w-full h-full object-cover" />
        <span v-else class="text-3xl font-bold text-teal-700 flex items-center justify-center h-full">
          {{ authStore.userProfile?.name?.charAt(0) }}
        </span>
      </div>
      <h2 class="text-xl font-bold text-gray-800">{{ authStore.userProfile?.name }}</h2>
      <p class="text-sm text-gray-500">{{ authStore.userProfile?.email }}</p>
    </div>

    <!-- Name Edit -->
    <div class="card mb-4">
      <label class="text-sm font-medium text-gray-700">নাম পরিবর্তন</label>
      <div class="flex gap-2 mt-1">
        <input v-model="newName" class="input-field flex-1" />
        <button @click="updateName" class="btn-primary text-sm px-3">সেভ</button>
      </div>
    </div>

    <!-- Mess Info -->
    <div v-if="messStore.mess" class="card mb-4">
      <p class="text-sm text-gray-500">বর্তমান মেস</p>
      <p class="font-bold text-gray-800">{{ messStore.mess.name }}</p>
      <p class="text-xs text-gray-400 mt-1">কোড: {{ messStore.mess.inviteCode }}</p>
    </div>

    <!-- Actions -->
    <div class="space-y-3">
      <button v-if="messStore.mess && !isAdmin" @click="handleLeaveMess"
        class="btn-danger w-full">
        🚪 মেস ছেড়ে দিন
      </button>
      <button @click="handleLogout" class="btn-secondary w-full">
        🔓 লগআউট
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'
import { useMess } from '../composables/useMess'

const router = useRouter()
const authStore = useAuthStore()
const messStore = useMessStore()
const { leaveMess } = useMess()

const newName = ref(authStore.userProfile?.name || '')
const isAdmin = computed(() => messStore.mess?.adminUid === authStore.user?.uid)

async function updateName() {
  if (!newName.value.trim()) return
  await authStore.updateProfile({ name: newName.value.trim() })
  alert('নাম আপডেট হয়েছে!')
}

async function handleLeaveMess() {
  if (!confirm('আপনি কি মেস ছেড়ে দিতে চান?')) return
  await leaveMess()
  router.push('/setup')
}

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>
