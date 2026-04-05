<template>
  <form @submit.prevent="handleSubmit" class="card space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-gray-800">💰 {{ isEdit ? 'জমা আপডেট করুন' : 'জমা যোগ করুন' }}</h3>
      <button v-if="isEdit" type="button" @click="$emit('cancel')" class="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">বাতিল</button>
    </div>
    <select v-model="form.userId" class="input-field" :disabled="isEdit" required>
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
      {{ submitting ? 'সেভ হচ্ছে...' : (isEdit ? '💾 আপডেট করুন' : '➕ জমা যোগ করুন') }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { getTodayBD } from '../../utils/helpers'

const props = defineProps({ members: Array, editItem: { type: Object, default: null } })
const emit = defineEmits(['submit', 'cancel'])

const submitting = ref(false)
const isEdit = computed(() => !!props.editItem)

const form = reactive({
  userId: '',
  amount: null,
  date: getTodayBD(),
  note: ''
})

watch(() => props.editItem, (newVal) => {
  if (newVal) {
    form.userId = newVal.userId
    form.amount = newVal.amount
    form.date = newVal.date
    form.note = newVal.note || ''
  } else {
    form.userId = ''
    form.amount = null
    form.date = getTodayBD()
    form.note = ''
  }
}, { immediate: true })

async function handleSubmit() {
  if (!form.userId || !form.amount) return
  submitting.value = true
  try {
    if (isEdit.value) {
      await emit('submit', { id: props.editItem.id, ...form })
    } else {
      await emit('submit', { ...form })
    }
  } finally {
    submitting.value = false
  }
}
</script>
