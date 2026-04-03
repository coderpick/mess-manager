import { ref } from 'vue'
import { db } from '../firebase/config'
import {
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc
} from 'firebase/firestore'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'

export function useDeposits() {
  const authStore = useAuthStore()
  const messStore = useMessStore()
  const deposits = ref([])
  const totalDeposits = ref(0)
  const loading = ref(false)
  let unsubscribe = null

  async function addDeposit(userId, amount, date, note = '') {
    const messId = messStore.mess.id
    const monthKey = date.substring(0, 7)
    await addDoc(collection(db, 'deposits'), {
      messId,
      userId,
      amount: Number(amount),
      date,
      monthKey,
      note,
      addedBy: authStore.user.uid,
      createdAt: new Date().toISOString()
    })
  }

  function listenDeposits(userId = null) {
    if (!messStore.mess) return
    if (unsubscribe) unsubscribe()

    let q
    if (userId) {
      q = query(
        collection(db, 'deposits'),
        where('messId', '==', messStore.mess.id),
        where('monthKey', '==', messStore.selectedMonth),
        where('userId', '==', userId)
      )
    } else {
      q = query(
        collection(db, 'deposits'),
        where('messId', '==', messStore.mess.id),
        where('monthKey', '==', messStore.selectedMonth)
      )
    }

    loading.value = true
    unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      list.sort((a, b) => b.date.localeCompare(a.date))
      deposits.value = list
      totalDeposits.value = list.reduce((s, d) => s + d.amount, 0)
      loading.value = false
    })
    return unsubscribe
  }

  async function deleteDeposit(id) {
    await deleteDoc(doc(db, 'deposits', id))
  }

  function stopListening() {
    if (unsubscribe) { unsubscribe(); unsubscribe = null }
  }

  return {
    deposits, totalDeposits, loading,
    addDeposit, listenDeposits, deleteDeposit, stopListening
  }
}
