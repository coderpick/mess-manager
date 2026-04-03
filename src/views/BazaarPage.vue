<template>
  <div class="page-container">
    <MonthSelector />

    <!-- Total -->
    <div class="card text-center mb-4">
      <p class="text-xs text-gray-500">এই মাসের মোট বাজার</p>
      <p class="text-3xl font-bold text-teal-700">৳{{ totalBazaar }}</p>
    </div>

    <!-- Form (Admin) -->
    <BazaarForm v-if="isAdmin" @submit="handleAdd" class="mb-4" />

    <div v-if="!isAdmin" class="text-center text-sm text-gray-400 mb-4">
      🔒 শুধুমাত্র এডমিন বাজার যোগ করতে পারবে
    </div>

    <!-- List -->
    <h3 class="font-bold text-gray-800 mb-2">📋 বাজার তালিকা</h3>
    <LoadingSpinner v-if="loading" />
    <BazaarList v-else :items="bazaarList" :is-admin="isAdmin"
      @remove="handleDelete" />
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'
import { useBazaar } from '../composables/useBazaar'
import MonthSelector from '../components/common/MonthSelector.vue'
import BazaarForm from '../components/bazaar/BazaarForm.vue'
import BazaarList from '../components/bazaar/BazaarList.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const messStore = useMessStore()
const { bazaarList, totalBazaar, loading, addBazaar, listenBazaar, deleteBazaar, stopListening } = useBazaar()

const isAdmin = computed(() => messStore.isAdmin)

async function handleAdd(data) {
  await addBazaar(data.date, data.description, data.amount)
}
async function handleDelete(id) {
  console.log('Admin Check - User:', authStore.user?.uid, 'Primary Admin:', messStore.mess?.adminUid)
  console.log('handleDelete called in BazaarPage with ID:', id)
  if (confirm('মুছে ফেলতে চান?')) {
    try {
      await deleteBazaar(id)
    } catch (e) {
      alert('Error: ' + e.message)
      console.error('Delete failed:', e)
    }
  }
}

function startListening() {
  if (messStore.mess) listenBazaar()
}

watch(() => messStore.selectedMonth, () => startListening())
watch(() => messStore.mess, () => startListening(), { immediate: true })

onMounted(() => startListening())
onUnmounted(() => stopListening())
</script>
