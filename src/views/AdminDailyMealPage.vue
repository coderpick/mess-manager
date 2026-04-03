<template>
  <div class="page-container">
    <div class="mb-4 flex items-center justify-between">
      <router-link to="/admin" class="text-teal-600 text-sm font-medium flex items-center gap-1">
        ← ফিরে যান
      </router-link>
      <h2 class="font-bold text-gray-800">📅 দৈনিক মিল আপডেট</h2>
    </div>

    <!-- Date Selector -->
    <div class="card mb-4">
      <label class="text-xs text-gray-500 block mb-1">তারিখ নির্বাচন করুন</label>
      <input type="date" v-model="selectedDate" @change="fetchMeals"
        class="w-full py-2 px-3 rounded-xl border-2 border-teal-100 focus:border-teal-400 outline-none font-medium text-gray-700" />
    </div>

    <LoadingSpinner v-if="loading" />
    
    <div v-else class="space-y-3">
      <div v-for="m in messStore.members" :key="m.id" class="card">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-50">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
              <img v-if="m.photoURL" :src="m.photoURL" class="w-full h-full object-cover" />
              <span v-else class="text-xs font-bold text-teal-700">{{ m.name?.charAt(0) }}</span>
            </div>
            <div>
              <p class="text-sm font-bold text-gray-800">{{ m.name }}</p>
              <p class="text-[10px] text-gray-400">{{ m.email }}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
              মোট: {{ (dailyMeals[m.id]?.total || 0).toFixed(1) }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div v-for="(label, key) in mealTypes" :key="key">
            <label class="text-[10px] text-gray-500 block mb-1 text-center">{{ label }}</label>
            <select :value="dailyMeals[m.id]?.[key] || 0"
              @change="updateMeal(m.id, key, $event.target.value)"
              class="w-full text-center py-1.5 rounded-lg border text-sm font-medium
                bg-white border-gray-100 focus:ring-2 focus:ring-teal-400 outline-none">
              <option v-for="v in (key === 'breakfast' ? [0, 0.5, 1, 1.5, 2] : [0, 1, 2, 3, 4, 5])" :key="v" :value="v">{{ v }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useMessStore } from '../stores/messStore'
import { useMeals } from '../composables/useMeals'
import { getTodayBD } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

const messStore = useMessStore()
const { saveMeal, getAllMealsOnce } = useMeals()

const selectedDate = ref(getTodayBD())
const loading = ref(false)
const dailyMeals = reactive({})

const mealTypes = {
  breakfast: '🌅 সকাল',
  lunch: '☀️ দুপুর',
  dinner: '🌙 রাত'
}

async function fetchMeals() {
  if (!selectedDate.value) return
  loading.value = true
  try {
    const monthKey = selectedDate.value.substring(0, 7)
    const all = await getAllMealsOnce(monthKey)
    
    // Reset dailyMeals
    Object.keys(dailyMeals).forEach(k => delete dailyMeals[k])
    
    // Filter for selected date
    all.filter(m => m.date === selectedDate.value).forEach(m => {
      dailyMeals[m.userId] = m
    })
  } finally {
    loading.value = false
  }
}

async function updateMeal(userId, key, val) {
  const current = dailyMeals[userId] || { breakfast: 0, lunch: 0, dinner: 0 }
  const breakfast = key === 'breakfast' ? Number(val) : (current.breakfast || 0)
  const lunch = key === 'lunch' ? Number(val) : (current.lunch || 0)
  const dinner = key === 'dinner' ? Number(val) : (current.dinner || 0)
  
  await saveMeal(selectedDate.value, breakfast, lunch, dinner, userId)
  
  // Optimistic update
  if (!dailyMeals[userId]) dailyMeals[userId] = { breakfast, lunch, dinner, total: 0 }
  dailyMeals[userId][key] = Number(val)
  dailyMeals[userId].total = breakfast + lunch + dinner
}

onMounted(() => {
  fetchMeals()
})
</script>
