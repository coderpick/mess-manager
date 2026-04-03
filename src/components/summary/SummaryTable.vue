<template>
  <div class="space-y-4">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 gap-3">
      <div class="card text-center">
        <p class="text-xs text-gray-500">মোট বাজার</p>
        <p class="text-xl font-bold text-teal-700">৳{{ totalBazaar }}</p>
      </div>
      <div class="card text-center">
        <p class="text-xs text-gray-500">মোট মিল</p>
        <p class="text-xl font-bold text-orange-600">{{ totalMeals.toFixed(1) }}</p>
      </div>
      <div class="card text-center col-span-2">
        <p class="text-xs text-gray-500">মিল রেট</p>
        <p class="text-2xl font-bold text-purple-600">
          ৳{{ mealRate.toFixed(2) }}
          <span class="text-sm font-normal text-gray-400">/মিল</span>
        </p>
      </div>
    </div>

    <!-- Summary Table -->
    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b-2 border-teal-100">
            <th class="text-left py-2 px-1">নাম</th>
            <th class="text-center py-2 px-1">মিল</th>
            <th class="text-center py-2 px-1">জমা</th>
            <th class="text-center py-2 px-1">খরচ</th>
            <th class="text-center py-2 px-1">ব্যালেন্স</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.userId"
            class="border-b border-gray-50">
            <td class="py-2 px-1 font-medium">{{ row.name }}</td>
            <td class="text-center py-2 px-1">{{ row.totalMeals.toFixed(1) }}</td>
            <td class="text-center py-2 px-1 text-green-600">৳{{ row.deposit }}</td>
            <td class="text-center py-2 px-1 text-red-500">৳{{ row.cost.toFixed(0) }}</td>
            <td class="text-center py-2 px-1 font-bold"
              :class="row.balance >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ row.balance >= 0 ? '+' : '' }}৳{{ row.balance.toFixed(0) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Legend -->
    <div class="text-xs text-gray-400 text-center space-y-1">
      <p>🟢 (+) = টাকা ফেরত পাবে | 🔴 (-) = টাকা দিতে হবে</p>
      <p>মিল রেট = মোট বাজার ÷ সবার মোট মিল</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  members: Array,
  allMeals: Array,
  allDeposits: Array,
  totalBazaar: Number
})

const totalMeals = computed(() =>
  props.allMeals.reduce((s, m) => s + (m.total || 0), 0)
)

const mealRate = computed(() =>
  totalMeals.value > 0 ? props.totalBazaar / totalMeals.value : 0
)

const rows = computed(() => {
  return props.members.map(member => {
    const myMeals = props.allMeals.filter(m => m.userId === member.id)
    const myTotalMeals = myMeals.reduce((s, m) => s + (m.total || 0), 0)
    const myDeposits = props.allDeposits
      .filter(d => d.userId === member.id)
      .reduce((s, d) => s + d.amount, 0)
    const cost = myTotalMeals * mealRate.value
    const balance = myDeposits - cost

    return {
      userId: member.id,
      name: member.name,
      totalMeals: myTotalMeals,
      deposit: myDeposits,
      cost,
      balance
    }
  })
})
</script>
