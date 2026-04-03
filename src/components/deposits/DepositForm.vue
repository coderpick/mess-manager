<template>
  <form @submit.prevent="handleSubmit" class="card space-y-3">
    <h3 class="font-bold text-gray-800">💰 জমা যোগ করুন</h3>
    <select v-model="form.userId" class="input-field" required>
      <option value="">-- সদস্য নির্বাচন করুন --</option>
      <option v-for="m in members" :key="m.id" :value="m.id">
        {{ m.name }}
      </option>
    </select>
    <input type="number" v-model.number="form.amount" placeholder="টাকার পরিমাণ"
      class="input-field" min="1" required />
    <input type="date" v-model="form.date" class="input-field" required />
    <input type="text" v-model="form.note" placeholder="নোট (ঐচ্ছিক)"
      class="input-field" />
    <button type="submit" class="btn-primary w-full" :disabled="submitting">
      {{ submitting ? 'সেভ হচ্ছে...' : '➕ জমা যোগ করুন' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { getTodayBD } from '../../utils/helpers'

const props = defineProps({ members: Array })
const emit = defineEmits(['submit'])
const submitting = ref(false)
const form = reactive({
  userId: '',
  amount: null,
  date: getTodayBD(),
  note: ''
})

async function handleSubmit() {
  if (!form.userId || !form.amount) return
  submitting.value = true
  try {
    await emit('submit', { ...form })
    form.userId = ''
    form.amount = null
    form.note = ''
  } finally {
    submitting.value = false
  }
}
</script>
