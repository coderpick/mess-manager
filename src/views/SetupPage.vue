<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-500 to-teal-700 
    flex items-center justify-center p-6">
    <div class="card max-w-sm w-full p-6">
      <div class="text-center mb-6">
        <div class="text-5xl mb-3">🏠</div>
        <h2 class="text-2xl font-bold text-gray-800">মেস সেটআপ</h2>
        <p class="text-gray-500 text-sm mt-1">নতুন মেস তৈরি করুন অথবা যোগ দিন</p>
      </div>

      <!-- Tab Toggle -->
      <div class="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button @click="tab = 'create'"
          class="flex-1 py-2 rounded-lg text-sm font-medium transition"
          :class="tab === 'create' ? 'bg-teal-600 text-white shadow' : 'text-gray-600'">
          ➕ নতুন তৈরি
        </button>
        <button @click="tab = 'join'"
          class="flex-1 py-2 rounded-lg text-sm font-medium transition"
          :class="tab === 'join' ? 'bg-teal-600 text-white shadow' : 'text-gray-600'">
          🔗 যোগ দিন
        </button>
      </div>

      <!-- Create Mess -->
      <form v-if="tab === 'create'" @submit.prevent="handleCreate" class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700">মেসের নাম</label>
          <input v-model="messName" type="text" placeholder="যেমন: গ্রীন ভিউ মেস"
            class="input-field mt-1" required />
        </div>
        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'তৈরি হচ্ছে...' : '🏠 মেস তৈরি করুন' }}
        </button>
      </form>

      <!-- Join Mess -->
      <form v-else @submit.prevent="handleJoin" class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700">ইনভাইট কোড</label>
          <input v-model="inviteCode" type="text" placeholder="৬ অক্ষরের কোড দিন"
            class="input-field mt-1 text-center tracking-[0.3em] uppercase font-mono text-lg"
            maxlength="6" required />
        </div>
        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'যোগ হচ্ছে...' : '🔗 মেসে যোগ দিন' }}
        </button>
      </form>

      <p v-if="error" class="mt-4 text-red-500 text-sm text-center">{{ error }}</p>
      <p v-if="success" class="mt-4 text-green-600 text-sm text-center">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMess } from '../composables/useMess'

const router = useRouter()
const { createMess, joinMess } = useMess()
const tab = ref('create')
const messName = ref('')
const inviteCode = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleCreate() {
  if (!messName.value.trim()) return
  loading.value = true
  error.value = ''
  try {
    await createMess(messName.value.trim())
    success.value = 'মেস তৈরি হয়েছে!'
    setTimeout(() => router.push('/dashboard'), 500)
  } catch (e) {
    error.value = e.message || 'মেস তৈরি ব্যর্থ হয়েছে'
  } finally {
    loading.value = false
  }
}

async function handleJoin() {
  if (!inviteCode.value.trim()) return
  loading.value = true
  error.value = ''
  try {
    await joinMess(inviteCode.value.trim())
    success.value = 'মেসে যোগ দেওয়া হয়েছে!'
    setTimeout(() => router.push('/dashboard'), 500)
  } catch (e) {
    error.value = e.message || 'যোগ দিতে ব্যর্থ হয়েছে'
  } finally {
    loading.value = false
  }
}
</script>
