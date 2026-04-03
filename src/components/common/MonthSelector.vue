<template>
  <div class="flex items-center justify-center gap-3 py-3">
    <button @click="prevMonth" class="w-9 h-9 rounded-full bg-teal-100 
      text-teal-700 flex items-center justify-center active:scale-90">
      ◀
    </button>
    <span class="font-semibold text-gray-700 min-w-[160px] text-center">
      {{ banglaMonthYear(messStore.selectedMonth) }}
    </span>
    <button @click="nextMonth" class="w-9 h-9 rounded-full bg-teal-100 
      text-teal-700 flex items-center justify-center active:scale-90">
      ▶
    </button>
  </div>
</template>
<script setup>
import { useMessStore } from '../../stores/messStore'
import { banglaMonthYear } from '../../utils/helpers'
const messStore = useMessStore()

function prevMonth() {
  const [y, m] = messStore.selectedMonth.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  messStore.setMonth(
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  )
}
function nextMonth() {
  const [y, m] = messStore.selectedMonth.split('-').map(Number)
  const d = new Date(y, m, 1)
  messStore.setMonth(
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  )
}
</script>
