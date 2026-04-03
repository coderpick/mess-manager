<template>
  <div class="page-container">
    <MonthSelector />

    <h2 class="font-bold text-gray-800 mb-3">📊 মাসিক হিসাব</h2>

    <LoadingSpinner v-if="loading" />
    <SummaryTable v-else
      :members="messStore.members"
      :all-meals="allMeals"
      :all-deposits="deposits"
      :total-bazaar="totalBazaar" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useMessStore } from '../stores/messStore'
import { useMeals } from '../composables/useMeals'
import { useBazaar } from '../composables/useBazaar'
import { useDeposits } from '../composables/useDeposits'
import MonthSelector from '../components/common/MonthSelector.vue'
import SummaryTable from '../components/summary/SummaryTable.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

const messStore = useMessStore()
const { allMeals, listenAllMeals, stopListening: stopMeals } = useMeals()
const { totalBazaar, listenBazaar, stopListening: stopBazaar } = useBazaar()
const { deposits, listenDeposits, stopListening: stopDeposits } = useDeposits()
const loading = ref(true)

function loadAll() {
  listenAllMeals()
  listenBazaar()
  listenDeposits()
  setTimeout(() => loading.value = false, 800)
}

watch(() => messStore.selectedMonth, () => {
  loading.value = true
  loadAll()
})
onMounted(() => loadAll())
onUnmounted(() => { stopMeals(); stopBazaar(); stopDeposits() })
</script>
