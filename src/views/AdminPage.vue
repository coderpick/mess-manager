<template>
  <div class="page-container">
    <h2 class="text-xl font-bold text-gray-800 mb-4">⚙️ মেস সেটিংস</h2>

    <template v-if="messStore.mess">
      <!-- Daily Meal Control -->
      <div class="card mb-4 bg-teal-50 border-teal-100">
        <h3 class="font-bold text-teal-800 mb-1">📅 দৈনিক মিল কন্ট্রোল</h3>
        <p class="text-[10px] text-teal-600 mb-3">মেসের সকল সদস্যের প্রতিদিনের মিল এখান থেকে আপডেট করতে পারবেন।</p>
        <router-link to="/admin/daily-meals" 
          class="btn-primary inline-block text-center text-xs px-4 py-2">
          ডেইলি মিল আপডেট করুন
        </router-link>
      </div>

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
              <span v-if="messStore.checkAdmin(m.id)"
                class="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                এডমিন
              </span>
              
              <router-link :to="`/admin/meals/${m.id}`" 
                class="text-xs bg-teal-50 text-teal-600 px-2 py-1 rounded-lg hover:bg-teal-100 transition">
                মিল এডিট
              </router-link>

              <div v-if="isAdmin" class="flex gap-1">
                <button v-if="!messStore.checkAdmin(m.id)"
                  @click="promoteMember(m.id, m.name)"
                  class="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100">
                  এডমিন করুন
                </button>
                <button v-else-if="m.id !== authStore.user.uid"
                  @click="demoteMember(m.id, m.name)"
                  class="text-[10px] bg-red-50 text-red-400 px-2 py-1 rounded-lg hover:bg-red-100">
                  এডমিন বাদ
                </button>
                <button v-if="!messStore.checkAdmin(m.id)"
                  @click="removeMember(m.id, m.name)"
                  class="text-[10px] bg-gray-100 text-gray-400 px-2 py-1 rounded-lg hover:bg-red-50 hover:text-red-500">
                  বাদ
                </button>
              </div>
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
const { updateMessName, removeMember: doRemove, promoteToAdmin, demoteFromAdmin } = useMess()

const isAdmin = computed(() => messStore.mess?.admins?.includes(authStore.user?.uid) || messStore.mess?.adminUid === authStore.user?.uid)
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

async function promoteMember(uid, name) {
  if (confirm(`${name} কে এডমিন করতে চান?`)) {
    await promoteToAdmin(uid)
    alert(`${name} এখন এডমিন!`)
  }
}

async function demoteMember(uid, name) {
  if (confirm(`${name} কে এডমিন থেকে বাদ দিতে চান?`)) {
    try {
      await demoteFromAdmin(uid)
      alert(`${name} আর এডমিন নন।`)
    } catch (e) {
      alert(e.message)
    }
  }
}
</script>
