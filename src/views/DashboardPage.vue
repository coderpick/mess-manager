<template>
  <div class="page-container">
    <LoadingSpinner v-if="loading" />

    <template v-else>
      <!-- Welcome -->
      <div class="mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          🙋 {{ greeting }}, {{ authStore.userProfile?.name?.split(' ')[0] }}!
        </h2>
        <p class="text-sm text-gray-500">{{ banglaDate(getTodayBD()) }}</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="card text-center">
          <p class="text-xs text-gray-500">আজকের মোট মিল</p>
          <p class="text-2xl font-bold text-teal-600">{{ todayTotal.toFixed(1) }}</p>
        </div>
        <div class="card text-center">
          <p class="text-xs text-gray-500">এই মাসের বাজার</p>
          <p class="text-2xl font-bold text-orange-600">৳{{ monthBazaar }}</p>
        </div>
        <div class="card text-center">
          <p class="text-xs text-gray-500">আমার মোট মিল</p>
          <p class="text-2xl font-bold text-purple-600">{{ myTotalMeals.toFixed(1) }}</p>
        </div>
        <div class="card text-center">
          <p class="text-xs text-gray-500">মিল রেট</p>
          <p class="text-2xl font-bold text-pink-600">
            ৳{{ mealRate.toFixed(2) }}
          </p>
        </div>
      </div>

      <!-- My Balance -->
      <div class="card mb-4">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-500">আমার ব্যালেন্স</p>
            <p class="text-3xl font-bold"
              :class="myBalance >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ myBalance >= 0 ? '+' : '' }}৳{{ myBalance.toFixed(0) }}
            </p>
          </div>
          <div class="text-right text-sm">
            <p class="text-gray-500">জমা: <span class="text-green-600 font-semibold">৳{{ myDeposit }}</span></p>
            <p class="text-gray-500">খরচ: <span class="text-red-500 font-semibold">৳{{ myCost.toFixed(0) }}</span></p>
          </div>
        </div>
      </div>

      <!-- Today Quick Meal -->
      <div class="card mb-4">
        <h3 class="font-bold text-gray-800 mb-3">🍛 আজকের মিল</h3>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="(meal, key) in mealTypes" :key="key" class="text-center">
            <label class="text-xs text-gray-500 block mb-1">{{ meal }}</label>
            <select :value="todayMeal[key] || 0"
              @change="saveTodayMeal(key, $event.target.value)"
              class="w-full text-center py-2 rounded-xl border-2 border-teal-200 
                font-bold text-teal-700 bg-teal-50 focus:ring-2 focus:ring-teal-400 outline-none">
              <option v-for="v in [0, 0.5, 1, 1.5, 2]" :key="v" :value="v">{{ v }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="grid grid-cols-2 gap-3">
        <router-link to="/meals"
          class="card text-center py-4 hover:bg-teal-50 transition active:scale-95">
          <span class="text-3xl">📝</span>
          <p class="font-medium text-gray-700 mt-1">মিল ইনপুট</p>
        </router-link>
        <router-link to="/summary"
          class="card text-center py-4 hover:bg-teal-50 transition active:scale-95">
          <span class="text-3xl">📊</span>
          <p class="font-medium text-gray-700 mt-1">মাসিক হিসাব</p>
        </router-link>
        <router-link v-if="isAdmin" to="/admin"
          class="card text-center py-4 hover:bg-orange-50 transition active:scale-95 col-span-2">
          <span class="text-3xl">⚙️</span>
          <p class="font-medium text-gray-700 mt-1">মেস সেটিংস</p>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'
import { useMeals } from '../composables/useMeals'
import { useBazaar } from '../composables/useBazaar'
import { useDeposits } from '../composables/useDeposits'
import { getTodayBD, banglaDate } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const messStore = useMessStore()
const { meals, allMeals, saveMeal, listenMyMeals, listenAllMeals, stopListening: stopMeals } = useMeals()
const { totalBazaar: monthBazaar, listenBazaar, stopListening: stopBazaar } = useBazaar()
const { deposits: allDeposits, listenDeposits, stopListening: stopDeposits } = useDeposits()

const loading = ref(true)
const isAdmin = computed(() => messStore.mess?.adminUid === authStore.user?.uid)

const mealTypes = { breakfast: '🌅 সকাল', lunch: '☀️ দুপুর', dinner: '🌙 রাত' }

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'সুপ্রভাত'
  if (h < 17) return 'শুভ দুপুর'
  return 'শুভ সন্ধ্যা'
})

const today = getTodayBD()
const todayMeal = computed(() => meals.value[today] || {})

const todayTotal = computed(() =>
  allMeals.value.filter(m => m.date === today)
    .reduce((s, m) => s + (m.total || 0), 0)
)

const myTotalMeals = computed(() =>
  Object.values(meals.value).reduce((s, m) => s + (m.total || 0), 0)
)

const totalAllMeals = computed(() =>
  allMeals.value.reduce((s, m) => s + (m.total || 0), 0)
)

const mealRate = computed(() =>
  totalAllMeals.value > 0 ? monthBazaar.value / totalAllMeals.value : 0
)

const myCost = computed(() => myTotalMeals.value * mealRate.value)

const myDeposit = computed(() =>
  allDeposits.value
    .filter(d => d.userId === authStore.user?.uid)
    .reduce((s, d) => s + d.amount, 0)
)

const myBalance = computed(() => myDeposit.value - myCost.value)

async function saveTodayMeal(key, val) {
  const current = todayMeal.value
  await saveMeal(today, 
    key === 'breakfast' ? Number(val) : (current.breakfast || 0),
    key === 'lunch' ? Number(val) : (current.lunch || 0),
    key === 'dinner' ? Number(val) : (current.dinner || 0)
  )
}

onMounted(() => {
  listenMyMeals()
  listenAllMeals()
  listenBazaar()
  listenDeposits()
  setTimeout(() => loading.value = false, 500)
})

onUnmounted(() => {
  stopMeals()
  stopBazaar()
  stopDeposits()
})
</script>
