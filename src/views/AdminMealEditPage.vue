<template>
  <div class="page-container">
    <div class="mb-4">
      <router-link to="/admin" class="text-teal-600 text-sm font-medium flex items-center gap-1 mb-2">
        ← ফিরে যান
      </router-link>
      <div v-if="member" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center overflow-hidden">
          <img v-if="member.photoURL" :src="member.photoURL" class="w-full h-full object-cover" />
          <span v-else class="text-lg font-bold text-teal-700">{{ member.name?.charAt(0) }}</span>
        </div>
        <div>
          <h2 class="font-bold text-gray-800">{{ member.name }} এর মিল</h2>
          <p class="text-xs text-gray-500">{{ member.email }}</p>
        </div>
      </div>
    </div>

    <MonthSelector />

    <div class="mb-3 flex items-center justify-between">
      <h3 class="font-bold text-gray-700 text-sm">📝 মিল আপডেট করুন</h3>
      <span class="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
        মোট: {{ totalMeals.toFixed(1) }} মিল
      </span>
    </div>

    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-3">
      <div v-for="date in days" :key="date" class="card">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-800">{{ toBanglaNum(parseInt(date.split('-')[2])) }}</span>
            <span class="text-xs text-gray-500">{{ getDayName(date) }}</span>
          </div>
          <span class="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
            {{ toBanglaNum(meals[date]?.total || 0) }}
          </span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="(meal, key) in mealTypes" :key="key">
            <label class="text-[10px] text-gray-500 block mb-1">{{ meal.label }}</label>
            <select :value="meals[date]?.[key] || 0"
              @change="handleUpdate(date, key, $event.target.value)"
              class="w-full text-center py-1.5 rounded-lg border text-sm font-medium
                bg-white border-gray-200 focus:ring-2 focus:ring-teal-400 outline-none">
              <option v-for="v in (key === 'breakfast' ? [0, 0.5, 1, 1.5, 2] : [0, 1, 2, 3, 4, 5])" :key="v" :value="v">{{ v }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import MonthSelector from '../components/common/MonthSelector.vue'
import { useMeals } from '../composables/useMeals'
import { useMessStore } from '../stores/messStore'
import { getDayName, getDaysInMonth, toBanglaNum } from '../utils/helpers'

const route = useRoute()
const userId = route.params.userId
const messStore = useMessStore()
const { meals, loading, saveMeal, listenUserMeals, stopListening } = useMeals()

const member = computed(() => messStore.members.find(m => m.id === userId))
const days = computed(() => getDaysInMonth(messStore.selectedMonth))
const totalMeals = computed(() => 
  Object.values(meals.value).reduce((s, m) => s + (m.total || 0), 0)
)

const mealTypes = {
  breakfast: { label: '🌅 সকাল' },
  lunch: { label: '☀️ দুপুর' },
  dinner: { label: '🌙 রাত' }
}

async function handleUpdate(date, key, val) {
  const current = meals.value[date] || {}
  const data = {
    breakfast: current.breakfast || 0,
    lunch: current.lunch || 0,
    dinner: current.dinner || 0,
    [key]: Number(val)
  }
  await saveMeal(date, data.breakfast, data.lunch, data.dinner, userId)
}

watch(() => messStore.selectedMonth, () => {
  listenUserMeals(userId)
})

onMounted(() => {
  if (!messStore.isAdmin) {
    alert('অনুমতি নেই!')
    window.location.href = '/dashboard'
    return
  }
  listenUserMeals(userId)
})

onUnmounted(() => stopListening())
</script>
