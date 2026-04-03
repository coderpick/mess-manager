<template>
  <div class="page-container">
    <MonthSelector />

    <!-- Total -->
    <div class="card text-center mb-4">
      <p class="text-xs text-gray-500">এই মাসের মোট জমা</p>
      <p class="text-3xl font-bold text-green-600">৳{{ totalDeposits }}</p>
    </div>

    <!-- Form (Admin) -->
    <DepositForm v-if="isAdmin" :members="messStore.members"
      @submit="handleAdd" class="mb-4" />

    <div v-if="!isAdmin" class="text-center text-sm text-gray-400 mb-4">
      🔒 শুধুমাত্র এডমিন জমা যোগ করতে পারবে
    </div>

    <!-- Toggle -->
    <div class="flex bg-gray-100 rounded-xl p-1 mb-3">
      <button @click="viewMode = 'all'"
        class="flex-1 py-2 rounded-lg text-sm font-medium transition"
        :class="viewMode === 'all' ? 'bg-white shadow text-teal-700' : 'text-gray-500'">
        সবার জমা
      </button>
      <button @click="viewMode = 'mine'"
        class="flex-1 py-2 rounded-lg text-sm font-medium transition"
        :class="viewMode === 'mine' ? 'bg-white shadow text-teal-700' : 'text-gray-500'">
        আমার জমা
      </button>
    </div>

    <LoadingSpinner v-if="loading" />
    <DepositList v-else :items="filteredDeposits" :members="messStore.members"
      :is-admin="isAdmin" @delete="handleDelete" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'
import { useDeposits } from '../composables/useDeposits'
import MonthSelector from '../components/common/MonthSelector.vue'
import DepositForm from '../components/deposits/DepositForm.vue'
import DepositList from '../components/deposits/DepositList.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const messStore = useMessStore()
const { deposits, totalDeposits, loading, addDeposit, listenDeposits, deleteDeposit, stopListening } = useDeposits()

const isAdmin = computed(() => messStore.mess?.adminUid === authStore.user?.uid)
const viewMode = ref('all')

const filteredDeposits = computed(() => {
  if (viewMode.value === 'mine') {
    return deposits.value.filter(d => d.userId === authStore.user?.uid)
  }
  return deposits.value
})

async function handleAdd(data) {
  await addDeposit(data.userId, data.amount, data.date, data.note)
}
async function handleDelete(id) {
  if (confirm('মুছে ফেলতে চান?')) await deleteDeposit(id)
}

watch(() => messStore.selectedMonth, () => listenDeposits())
onMounted(() => listenDeposits())
onUnmounted(() => stopListening())
</script>
