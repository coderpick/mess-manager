<template>
  <form @submit.prevent="handleSubmit" class="card space-y-3">
    <h3 class="font-bold text-gray-800">🛒 নতুন বাজার যোগ করুন</h3>
    <input type="date" v-model="form.date" class="input-field" required />
    <input type="text" v-model="form.description" placeholder="বিবরণ (চাল, ডাল, তেল...)"
      class="input-field" required />
    <input type="number" v-model.number="form.amount" placeholder="টাকার পরিমাণ"
      class="input-field" min="1" required />
    <button type="submit" class="btn-primary w-full" :disabled="submitting">
      {{ submitting ? 'সেভ হচ্ছে...' : '➕ যোগ করুন' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { getTodayBD } from '../../utils/helpers'

const emit = defineEmits(['submit'])
const submitting = ref(false)
const form = reactive({
  date: getTodayBD(),
  description: '',
  amount: null
})

async function handleSubmit() {
  if (!form.amount || form.amount <= 0) return
  submitting.value = true
  try {
    await emit('submit', { ...form })
    form.description = ''
    form.amount = null
  } finally {
    submitting.value = false
  }
}
</script>
