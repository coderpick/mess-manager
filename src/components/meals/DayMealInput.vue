<template>
  <div class="card" :class="{ 'opacity-60 bg-gray-50': locked, 
    'ring-2 ring-teal-400': today }">
    <div class="flex items-center justify-between mb-2">
      <div>
        <span class="font-bold text-gray-800">
          {{ toBanglaNum(parseInt(date.split('-')[2])) }}
        </span>
        <span class="text-xs text-gray-500 ml-1">{{ getDayName(date) }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span v-if="locked" class="text-sm">🔒</span>
        <span v-if="today"
          class="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
          আজ
        </span>
        <span class="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
          {{ toBanglaNum(totalMeal) }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <div v-for="(meal, key) in mealTypes" :key="key" class="text-center">
        <label class="text-[10px] text-gray-500 block mb-1">{{ meal.label }}</label>
        <select v-if="!locked"
          :value="values[key]"
          @change="updateMeal(key, $event.target.value)"
          class="w-full text-center py-1.5 rounded-lg border text-sm font-medium
            bg-white border-gray-200 focus:ring-2 focus:ring-teal-400 outline-none">
          <option v-for="v in mealOptions" :key="v" :value="v">{{ v }}</option>
        </select>
        <div v-else class="py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-600">
          {{ values[key] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isPastDate, isToday, toBanglaNum, getDayName } from '../../utils/helpers'

const props = defineProps({
  date: String,
  breakfast: { type: Number, default: 0 },
  lunch: { type: Number, default: 0 },
  dinner: { type: Number, default: 0 }
})

const emit = defineEmits(['save'])

const locked = computed(() => isPastDate(props.date))
const today = computed(() => isToday(props.date))
const mealOptions = [0, 0.5, 1, 1.5, 2]
const mealTypes = {
  breakfast: { label: '🌅 সকাল' },
  lunch: { label: '☀️ দুপুর' },
  dinner: { label: '🌙 রাত' }
}
const values = computed(() => ({
  breakfast: props.breakfast,
  lunch: props.lunch,
  dinner: props.dinner
}))
const totalMeal = computed(() => props.breakfast + props.lunch + props.dinner)

function updateMeal(key, val) {
  const updated = {
    breakfast: props.breakfast,
    lunch: props.lunch,
    dinner: props.dinner,
    [key]: Number(val)
  }
  emit('save', { date: props.date, ...updated })
}
</script>
