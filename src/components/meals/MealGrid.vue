<template>
  <div class="space-y-3">
    <DayMealInput
      v-for="date in days"
      :key="date"
      :date="date"
      :breakfast="getMeal(date, 'breakfast')"
      :lunch="getMeal(date, 'lunch')"
      :dinner="getMeal(date, 'dinner')"
      @save="onSave"
    />
  </div>
</template>

<script setup>
import DayMealInput from './DayMealInput.vue'

const props = defineProps({
  days: Array,
  meals: Object
})
const emit = defineEmits(['save'])

function getMeal(date, type) {
  return props.meals?.[date]?.[type] || 0
}
function onSave(data) {
  emit('save', data)
}
</script>
