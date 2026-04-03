import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { getCurrentMonthKey } from '../utils/helpers'
import { useAuthStore } from './authStore'

export const useMessStore = defineStore('mess', () => {
  const mess = ref(null)
  const members = ref([])
  const selectedMonth = ref(getCurrentMonthKey())
  const loading = ref(false)

  const isAdmin = computed(() => {
    if (!mess.value) return false
    const authStore = useAuthStore()
    return mess.value.adminUid === authStore.user?.uid
  })

  async function loadMess(messId) {
    if (!messId) { mess.value = null; return }
    loading.value = true
    try {
      const snap = await getDoc(doc(db, 'messes', messId))
      if (snap.exists()) {
        mess.value = { id: snap.id, ...snap.data() }
        await loadMembers()
      }
    } finally {
      loading.value = false
    }
  }

  async function loadMembers() {
    if (!mess.value?.members?.length) { members.value = []; return }
    const promises = mess.value.members.map(async (uid) => {
      const snap = await getDoc(doc(db, 'users', uid))
      return snap.exists() ? { id: snap.id, ...snap.data() } : null
    })
    members.value = (await Promise.all(promises)).filter(Boolean)
  }

  function setMonth(monthKey) {
    selectedMonth.value = monthKey
  }

  function checkAdmin(uid) {
    return mess.value?.adminUid === uid
  }

  return {
    mess, members, selectedMonth, loading,
    isAdmin, loadMess, loadMembers, setMonth, checkAdmin
  }
})
