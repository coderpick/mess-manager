import { ref } from 'vue'
import { db } from '../firebase/config'
import {
  collection, addDoc, query, where, onSnapshot,
  orderBy, deleteDoc, doc
} from 'firebase/firestore'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'

export function useBazaar() {
  const authStore = useAuthStore()
  const messStore = useMessStore()
  const bazaarList = ref([])
  const totalBazaar = ref(0)
  const loading = ref(false)
  let unsubscribe = null

  async function addBazaar(date, description, amount) {
    const messId = messStore.mess.id
    const monthKey = date.substring(0, 7)
    await addDoc(collection(db, 'bazaar'), {
      messId,
      date,
      monthKey,
      description,
      amount: Number(amount),
      addedBy: authStore.user.uid,
      createdAt: new Date().toISOString()
    })
  }

  function listenBazaar() {
    if (!messStore.mess) return
    if (unsubscribe) unsubscribe()

    const q = query(
      collection(db, 'bazaar'),
      where('messId', '==', messStore.mess.id),
      where('monthKey', '==', messStore.selectedMonth)
    )

    loading.value = true
    unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      list.sort((a, b) => b.date.localeCompare(a.date))
      bazaarList.value = list
      totalBazaar.value = list.reduce((s, b) => s + b.amount, 0)
      loading.value = false
    })
  }

  async function deleteBazaar(id) {
    await deleteDoc(doc(db, 'bazaar', id))
  }

  function stopListening() {
    if (unsubscribe) { unsubscribe(); unsubscribe = null }
  }

  return {
    bazaarList, totalBazaar, loading,
    addBazaar, listenBazaar, deleteBazaar, stopListening
  }
}
