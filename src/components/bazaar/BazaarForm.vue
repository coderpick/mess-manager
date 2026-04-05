<template>
  <form @submit.prevent="handleSubmit" class="card space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-gray-800">🛒 {{ isEdit ? 'বাজার আপডেট করুন' : 'নতুন বাজার যোগ করুন' }}</h3>
      <button v-if="isEdit" type="button" @click="$emit('cancel')" class="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">বাতিল</button>
    </div>
    <input type="date" v-model="form.date" class="input-field" required />
    <input type="text" v-model="form.description" placeholder="বিবরণ (চাল, ডাল, তেল...)"
      class="input-field" required />
    <input type="number" v-model.number="form.amount" placeholder="টাকার পরিমাণ"
      class="input-field" min="1" required />
    <button type="submit" class="btn-primary w-full" :disabled="submitting">
      {{ submitting ? 'সেভ হচ্ছে...' : (isEdit ? '💾 আপডেট করুন' : '➕ যোগ করুন') }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { getTodayBD } from '../../utils/helpers'

const props = defineProps({ editItem: { type: Object, default: null } })
const emit = defineEmits(['submit', 'cancel'])

const submitting = ref(false)
const isEdit = computed(() => !!props.editItem)

const form = reactive({
  date: getTodayBD(),
  description: '',
  amount: null
})

watch(() => props.editItem, (newVal) => {
  if (newVal) {
    form.date = newVal.date
    form.description = newVal.description
    form.amount = newVal.amount
  } else {
    form.date = getTodayBD()
    form.description = ''
    form.amount = null
  }
}, { immediate: true })

async function handleSubmit() {
  if (!form.amount || form.amount <= 0) return
  submitting.value = true
  try {
    if (isEdit.value) {
      await emit('submit', { id: props.editItem.id, ...form })
    } else {
      await emit('submit', { ...form })
    }
    if (!isEdit.value) {
      form.description = ''
      form.amount = null
    }
  } finally {
    submitting.value = false
  }
}
</script>
