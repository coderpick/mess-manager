<template>
  <div class="page-container">
    <h2 class="text-xl font-bold text-gray-800 mb-4">⚙️ মেস সেটিংস</h2>

    <template v-if="messStore.mess">
      <!-- Mess Info -->
      <div class="card mb-4">
        <h3 class="font-bold text-gray-700 mb-3">মেসের তথ্য</h3>
        <div class="space-y-3">
          <div>
            <label class="text-sm text-gray-500">মেসের নাম</label>
            <div class="flex gap-2 mt-1">
              <input v-model="editName" class="input-field flex-1" />
              <button @click="saveName" class="btn-primary text-sm px-3">সেভ</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Invite Code -->
      <div class="card mb-4">
        <h3 class="font-bold text-gray-700 mb-2">🔗 ইনভাইট কোড</h3>
        <p class="text-sm text-gray-500 mb-2">এই কোড শেয়ার করুন নতুন সদস্য যোগ করতে</p>
        <div class="flex items-center gap-2">
          <div class="flex-1 bg-teal-50 border-2 border-teal-200 rounded-xl py-3 
            text-center text-2xl font-mono font-bold tracking-[0.5em] text-teal-700">
            {{ messStore.mess.inviteCode }}
          </div>
          <button @click="copyCode"
            class="btn-secondary text-sm px-3 py-3">
            {{ copied ? '✅' : '📋' }}
          </button>
        </div>
      </div>

      <!-- Members -->
      <div class="card mb-4">
        <h3 class="font-bold text-gray-700 mb-3">
          👥 সদস্য তালিকা ({{ messStore.members.length }} জন)
        </h3>
        <div class="space-y-2">
          <div v-for="m in messStore.members" :key="m.id"
            class="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-teal-200 flex items-center justify-center overflow-hidden">
                <img v-if="m.photoURL" :src="m.photoURL" class="w-full h-full object-cover" />
                <span v-else class="text-sm font-bold text-teal-700">
                  {{ m.name?.charAt(0) }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-800 text-sm">{{ m.name }}</p>
                <p class="text-xs text-gray-400">{{ m.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="m.id === messStore.mess.adminUid"
                class="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                এডমিন
              </span>
              <button v-else-if="isAdmin"
                @click="removeMember(m.id, m.name)"
                class="text-xs text-red-400 hover:text-red-600">
                বাদ দিন
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'
import { useMess } from '../composables/useMess'

const authStore = useAuthStore()
const messStore = useMessStore()
const { updateMessName, removeMember: doRemove } = useMess()

const isAdmin = computed(() => messStore.mess?.adminUid === authStore.user?.uid)
const editName = ref(messStore.mess?.name || '')
const copied = ref(false)

async function saveName() {
  if (!editName.value.trim()) return
  await updateMessName(editName.value.trim())
  alert('নাম আপডেট হয়েছে!')
}

function copyCode() {
  navigator.clipboard.writeText(messStore.mess.inviteCode)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

async function removeMember(uid, name) {
  if (confirm(`${name} কে মেস থেকে বাদ দিতে চান?`)) {
    await doRemove(uid)
  }
}
</script>
