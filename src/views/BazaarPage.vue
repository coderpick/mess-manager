<template>
  <div class="page-container">
    <MonthSelector />

    <!-- Total -->
    <div class="card text-center mb-4">
      <p class="text-xs text-gray-500">এই মাসের মোট বাজার</p>
      <p class="text-3xl font-bold text-teal-700">৳{{ totalBazaar }}</p>
    </div>

    <!-- Form (Admin) -->
    <BazaarForm v-if="isAdmin" :edit-item="editItem" @submit="handleSubmit" @cancel="cancelEdit" class="mb-4" />

    <div v-if="!isAdmin" class="text-center text-sm text-gray-400 mb-4">
      🔒 শুধুমাত্র এডমিন বাজার যোগ/আপডেট করতে পারবে
    </div>

    <!-- List -->
    <h3 class="font-bold text-gray-800 mb-2">📋 বাজার তালিকা</h3>
    <LoadingSpinner v-if="loading" />
    <BazaarList v-else :items="bazaarList" :is-admin="isAdmin"
      @edit="handleEdit" @remove="handleDelete" />
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'
import { useBazaar } from '../composables/useBazaar'
import MonthSelector from '../components/common/MonthSelector.vue'
import BazaarForm from '../components/bazaar/BazaarForm.vue'
import BazaarList from '../components/bazaar/BazaarList.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const messStore = useMessStore()
const { bazaarList, totalBazaar, loading, addBazaar, updateBazaar, listenBazaar, deleteBazaar, stopListening } = useBazaar()

const isAdmin = computed(() => messStore.isAdmin)
const editItem = ref(null)

async function handleSubmit(data) {
  if (data.id) {
    await updateBazaar(data.id, data.date, data.description, data.amount)
    editItem.value = null
  } else {
    await addBazaar(data.date, data.description, data.amount)
  }
}

function handleEdit(item) {
  editItem.value = item
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editItem.value = null
}

async function handleDelete(id) {
  if (confirm('মুছে ফেলতে চান?')) {
    try {
      if (editItem.value?.id === id) editItem.value = null
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
