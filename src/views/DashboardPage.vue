<template>
  <div class="page-container !pt-0 !px-0 flex flex-col min-h-screen bg-slate-50/50">
    <LoadingSpinner v-if="loading" />

    <template v-else>
      <!-- Hero Header -->
      <div class="gradient-teal pt-10 pb-20 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div class="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>
        
        <div class="relative z-10 fade-in">
          <h2 class="text-2xl font-extrabold text-white mb-1 tracking-tight">
            🙋 {{ greeting }}, {{ authStore.userProfile?.name?.split(' ')[0] }}!
          </h2>
          <p class="text-teal-50 text-sm font-medium opacity-90">{{ banglaDate(getTodayBD()) }}</p>
        </div>
      </div>

      <!-- Main Content (Pulled Up) -->
      <div class="px-5 -mt-12 space-y-5 pb-10">
        
        <!-- Total Today Stats Card -->
        <div class="glass-card rounded-[32px] p-6 premium-shadow fade-in" style="animation-delay: 0.1s">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-gray-900 font-bold flex items-center gap-2">
              <span class="w-2 h-6 gradient-teal rounded-full"></span>
              আজকের মোট মিল
            </h3>
            <span class="text-[11px] font-bold bg-teal-100 text-teal-700 px-3 py-1 rounded-full border border-teal-200/50 uppercase">
              {{ todayTotal.memberCount }} জন সদস্য
            </span>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div class="text-center group">
              <div class="text-xl font-black text-teal-600 mb-0.5 group-hover:scale-110 transition">{{ todayTotal.breakfast.toFixed(1) }}</div>
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">সকাল</div>
            </div>
            <div class="w-[1px] h-8 bg-gray-100 my-auto"></div>
            <div class="text-center group">
              <div class="text-xl font-black text-teal-600 mb-0.5 group-hover:scale-110 transition">{{ todayTotal.lunch.toFixed(1) }}</div>
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">দুপুর</div>
            </div>
            <div class="w-[1px] h-8 bg-gray-100 my-auto"></div>
            <div class="text-center group">
              <div class="text-xl font-black text-teal-600 mb-0.5 group-hover:scale-110 transition">{{ todayTotal.dinner.toFixed(1) }}</div>
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">রাত</div>
            </div>
            <div class="w-[1px] h-8 bg-gray-100 my-auto"></div>
            <div class="text-center group">
              <div class="text-xl font-black text-slate-800 mb-0.5 group-hover:scale-110 transition">{{ todayTotal.all.toFixed(1) }}</div>
              <div class="text-[10px] font-bold text-teal-700 uppercase tracking-wider">মোট</div>
            </div>
          </div>
        </div>

        <!-- Secondary Stats Grid -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Bazaar Card -->
          <div class="bg-white rounded-3xl p-5 premium-shadow border border-gray-100/50 flex flex-col items-center group fade-in" style="animation-delay: 0.2s">
            <div class="w-10 h-10 rounded-2xl gradient-orange flex items-center justify-center text-white mb-3 shadow-md group-hover:rotate-12 transition">🛒</div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">এই মাসের বাজার</p>
            <p class="text-2xl font-black text-orange-600">৳{{ monthBazaar }}</p>
          </div>
          
          <!-- My Meal Card -->
          <div class="bg-white rounded-3xl p-5 premium-shadow border border-gray-100/50 flex flex-col items-center group fade-in" style="animation-delay: 0.25s">
            <div class="w-10 h-10 rounded-2xl gradient-purple flex items-center justify-center text-white mb-3 shadow-md group-hover:-rotate-12 transition">🍛</div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">আমার মোট মিল</p>
            <p class="text-2xl font-black text-purple-600">{{ myTotalMeals.toFixed(1) }}</p>
          </div>
        </div>

        <!-- Balance Section -->
        <div class="bg-white rounded-[32px] p-6 premium-shadow border border-gray-100/50 fade-in" style="animation-delay: 0.3s">
          <div class="flex justify-between items-end">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">আমার ব্যালেন্স</p>
              <h3 class="text-4xl font-black tracking-tighter"
                :class="myBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                {{ myBalance >= 0 ? '+' : '' }}৳{{ myBalance.toFixed(0) }}
              </h3>
            </div>
            <div class="text-right flex flex-col gap-1">
              <div class="flex items-center justify-end gap-2">
                <span class="text-[10px] font-bold text-gray-400 uppercase">জমা:</span>
                <span class="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">৳{{ myDeposit }}</span>
              </div>
              <div class="flex items-center justify-end gap-2">
                <span class="text-[10px] font-bold text-gray-400 uppercase">খরচ:</span>
                <span class="text-sm font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">৳{{ myCost.toFixed(0) }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
             <div class="flex items-center gap-2">
               <div class="w-8 h-8 rounded-full gradient-pink flex items-center justify-center text-white text-xs shadow-sm">💰</div>
               <div>
                 <p class="text-[8px] font-bold text-gray-400 uppercase leading-none mb-1">কারেন্ট মিল রেট</p>
                 <p class="text-sm font-black text-gray-700 leading-none">৳{{ mealRate.toFixed(2) }}</p>
               </div>
             </div>
             <router-link to="/deposits" class="text-xs font-bold text-teal-600 hover:underline">ডিটেইলস দেখুন →</router-link>
          </div>
        </div>

        <!-- Member List High-End -->
        <div class="bg-white rounded-[32px] p-6 premium-shadow border border-gray-100/50 fade-in" style="animation-delay: 0.35s">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-gray-900 font-bold flex items-center gap-2 text-lg">
              <span class="w-2 h-6 gradient-purple rounded-full"></span>
              মেস সদস্যবৃন্দ
            </h3>
            <span class="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">
              {{ messStore.members.length }} মেম্বার
            </span>
          </div>
          
          <div class="space-y-4">
            <div v-for="m in membersWithTotals" :key="m.id"
              class="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 hover:bg-teal-50/30 transition border border-transparent hover:border-teal-100 group">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-white shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:scale-105 transition">
                  <img v-if="m.photoURL" :src="m.photoURL" class="w-full h-full object-cover" />
                  <span v-else class="text-lg font-black text-teal-700">{{ m.name?.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <p class="text-sm font-bold text-gray-800 truncate">{{ m.name }}</p>
                    <span v-if="messStore.checkAdmin(m.id)" 
                      class="text-[7px] gradient-orange text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">
                      Admin
                    </span>
                  </div>
                  <p class="text-[10px] text-gray-400 truncate opacity-80 font-medium">{{ m.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <p class="text-sm font-black text-teal-700 leading-none">{{ m.totalMeals.toFixed(1) }}</p>
                  <p class="text-[7px] font-bold text-gray-400 uppercase mt-1">TOTAL MEALS</p>
                </div>
                <router-link v-if="isAdmin" :to="`/admin/meals/${m.id}`"
                  class="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-teal-600 hover:border-teal-200 hover:shadow-md transition">
                  <span class="text-xs">📝</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Today Input Card -->
        <div class="gradient-teal rounded-[32px] p-6 text-white shadow-xl premium-shadow fade-in" style="animation-delay: 0.4s">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-extrabold text-xl tracking-tight">🍛 আজকের মিল এন্ট্রি</h3>
            <div class="flex -space-x-2">
               <div v-for="i in 3" :key="i" class="w-6 h-6 rounded-full border-2 border-teal-500 bg-white/20"></div>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-3">
            <div v-for="(meal, key) in mealTypes" :key="key" class="space-y-1.5 focus-within:scale-105 transition">
              <label class="text-[10px] font-black text-teal-100 uppercase tracking-widest pl-1">{{ meal.split(' ')[1] }}</label>
              <div class="relative group">
                <select :value="todayMeal[key] || 0"
                  @change="saveTodayMeal(key, $event.target.value)"
                  class="w-full text-center py-3.5 rounded-2xl bg-white/10 border border-white/20 
                    font-black text-white focus:bg-white focus:text-teal-800 transition-all outline-none appearance-none cursor-pointer">
                  <option v-for="v in (key === 'breakfast' ? [0, 0.5, 1, 1.5, 2] : [0, 1, 2, 3, 4, 5])" :key="v" :value="v" class="text-gray-800">{{ v }}</option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[8px]">▼</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Premium Quick Links -->
        <div class="grid grid-cols-2 gap-4 pb-4 fade-in" style="animation-delay: 0.45s">
          <router-link to="/meals"
            class="bg-white rounded-[28px] p-5 flex flex-col items-center premium-shadow border border-gray-50 hover:bg-teal-50/40 transition active:scale-95 group">
            <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">📋</div>
            <p class="font-bold text-gray-800 text-sm">মিল ইনপুট</p>
            <p class="text-[8px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Enter Daily Meals</p>
          </router-link>
          
          <router-link to="/summary"
            class="bg-white rounded-[28px] p-5 flex flex-col items-center premium-shadow border border-gray-50 hover:bg-emerald-50/40 transition active:scale-95 group">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">📊</div>
            <p class="font-bold text-gray-800 text-sm">মাসিক হিসাব</p>
            <p class="text-[8px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">View Summaries</p>
          </router-link>
          
          <router-link v-if="isAdmin" to="/admin"
            class="col-span-2 gradient-teal rounded-[28px] p-5 flex items-center justify-between premium-shadow hover:brightness-110 transition active:scale-95 group relative overflow-hidden">
            <div class="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
            <div class="flex items-center gap-4 relative z-10">
              <div class="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center text-2xl group-hover:rotate-12 transition">⚙️</div>
              <div>
                <p class="font-black text-white">মেস এডমিন সেটিংস</p>
                <p class="text-[10px] text-teal-100/70 font-medium tracking-tight">Manage members, meals & bazaar</p>
              </div>
            </div>
            <div class="text-white relative z-10 font-bold text-xl opacity-50 group-hover:translate-x-1 transition">→</div>
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { useBazaar } from '../composables/useBazaar'
import { useDeposits } from '../composables/useDeposits'
import { useMeals } from '../composables/useMeals'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'
import { banglaDate, getTodayBD } from '../utils/helpers'

const authStore = useAuthStore()
const messStore = useMessStore()
const { meals, allMeals, saveMeal, listenUserMeals, listenAllMeals, stopListening: stopMeals } = useMeals()
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

const todayTotal = computed(() => {
  const memberIds = messStore.members.map(m => m.id)
  const tMeals = allMeals.value.filter(m => m.date === today && memberIds.includes(m.userId))
  
  // Group by userId to prevent double-counting if duplicate docs exist
  const userMap = {}
  tMeals.forEach(m => {
    if (!userMap[m.userId] || (m.updatedAt > userMap[m.userId].updatedAt)) {
      userMap[m.userId] = m
    }
  })

  const stats = { breakfast: 0, lunch: 0, dinner: 0, all: 0, memberCount: Object.keys(userMap).length }
  Object.values(userMap).forEach(m => {
    stats.breakfast += (m.breakfast || 0)
    stats.lunch += (m.lunch || 0)
    stats.dinner += (m.dinner || 0)
    stats.all += (m.total || 0)
  })
  return stats
})

const myTotalMeals = computed(() =>
  Object.values(meals.value).reduce((s, m) => s + (m.total || 0), 0)
)

const totalAllMeals = computed(() => {
  const memberIds = messStore.members.map(m => m.id)
  return allMeals.value
    .filter(m => memberIds.includes(m.userId))
    .reduce((s, m) => s + (m.total || 0), 0)
})

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

const membersWithTotals = computed(() => {
  return messStore.members.map(m => {
    const total = allMeals.value
      .filter(ml => ml.userId === m.id)
      .reduce((s, ml) => s + (ml.total || 0), 0)
    return { ...m, totalMeals: total }
  })
})

async function saveTodayMeal(key, val) {
  const current = todayMeal.value
  const breakfast = key === 'breakfast' ? Number(val) : (current.breakfast || 0)
  const lunch = key === 'lunch' ? Number(val) : (current.lunch || 0)
  const dinner = key === 'dinner' ? Number(val) : (current.dinner || 0)
  
  await saveMeal(today, breakfast, lunch, dinner)
}

function startListeners() {
  if (!messStore.mess) return
  listenUserMeals(authStore.user?.uid)
  listenAllMeals()
  listenBazaar()
  listenDeposits()
  loading.value = false
}

watch(() => messStore.mess, (newMess) => {
  if (newMess) startListeners()
}, { immediate: true })

onMounted(() => {
  if (messStore.mess) startListeners()
  // Fallback if loading takes too long
  setTimeout(() => {
    if (loading.value) loading.value = false
  }, 3000)
})

onUnmounted(() => {
  stopMeals()
  stopBazaar()
  stopDeposits()
})
</script>
