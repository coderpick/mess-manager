<template>
  <div class="page-container">
    <MonthSelector />

    <div class="mb-3 flex items-center justify-between">
      <h2 class="font-bold text-gray-800">📝 মিল ইনপুট</h2>
      <span class="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
        মোট: {{ totalMeals.toFixed(1) }} মিল
      </span>
    </div>

    <LoadingSpinner v-if="loading" />
    <MealGrid v-else :days="days" :meals="meals" @save="handleSave" />
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'
import { useMeals } from '../composables/useMeals'
import { getDaysInMonth } from '../utils/helpers'
import MonthSelector from '../components/common/MonthSelector.vue'
import MealGrid from '../components/meals/MealGrid.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const messStore = useMessStore()
const { meals, loading, saveMeal, listenUserMeals, stopListening } = useMeals()

const days = computed(() => getDaysInMonth(messStore.selectedMonth))
const totalMeals = computed(() =>
  Object.values(meals.value).reduce((s, m) => s + (m.total || 0), 0)
)

async function handleSave({ date, breakfast, lunch, dinner }) {
  await saveMeal(date, breakfast, lunch, dinner)
}

watch(() => messStore.selectedMonth, () => {
  if (messStore.mess) listenUserMeals(authStore.user?.uid)
})

watch(() => messStore.mess, (newMess) => {
  if (newMess) listenUserMeals(authStore.user?.uid)
}, { immediate: true })

onMounted(() => {
  if (messStore.mess) listenUserMeals(authStore.user?.uid)
})
onUnmounted(() => stopListening())
</script>
