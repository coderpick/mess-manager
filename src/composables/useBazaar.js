import { ref } from 'vue'
import { db } from '../firebase/config'
import {
  collection, addDoc, query, where, onSnapshot,
  orderBy, deleteDoc, doc, setDoc
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
    try {
      const messId = messStore.mess.id
      const monthKey = date.substring(0, 7)
      console.log('Adding Bazaar entry:', { messId, date, description, amount })
      await addDoc(collection(db, 'bazaar'), {
        messId,
        adminUid: messStore.mess.adminUid, // Added to help with permissions
        date,
        monthKey,
        description,
        amount: Number(amount),
        addedBy: authStore.user.uid,
        createdAt: new Date().toISOString()
      })
      console.log('Bazaar entry added successfully')
    } catch (error) {
      console.error('Error adding bazaar:', error)
      throw error
    }
  }

  async function updateBazaar(id, date, description, amount) {
    try {
      const monthKey = date.substring(0, 7)
      console.log('Updating Bazaar entry:', id, { date, description, amount })
      await setDoc(doc(db, 'bazaar', id), {
        date,
        monthKey,
        description,
        amount: Number(amount)
      }, { merge: true })
      console.log('Bazaar entry updated successfully')
    } catch (error) {
      console.error('Error updating bazaar:', error)
      throw error
    }
  }

  function listenBazaar() {
    if (!messStore.mess) return
    if (unsubscribe) unsubscribe()

    console.log('Listening to Bazaar for mess:', messStore.mess.id, 'month:', messStore.selectedMonth)
    const q = query(
      collection(db, 'bazaar'),
      where('messId', '==', messStore.mess.id),
      where('monthKey', '==', messStore.selectedMonth)
    )

    loading.value = true
    unsubscribe = onSnapshot(q, (snap) => {
      console.log('Bazaar Snapshot received, docs:', snap.size)
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      list.sort((a, b) => b.date.localeCompare(a.date))
      bazaarList.value = list
      totalBazaar.value = list.reduce((s, b) => s + b.amount, 0)
      loading.value = false
    }, (error) => {
      console.error('Bazaar Listener error:', error)
      loading.value = false
    })
    return unsubscribe
  }

  async function deleteBazaar(id) {
    try {
      console.log('Deleting Bazaar entry:', id)
      await deleteDoc(doc(db, 'bazaar', id))
      console.log('Bazaar entry deleted successfully')
    } catch (error) {
      console.error('Error deleting bazaar:', error)
      throw error
    }
  }

  function stopListening() {
    if (unsubscribe) { unsubscribe(); unsubscribe = null }
  }

  return {
    bazaarList, totalBazaar, loading,
    addBazaar, updateBazaar, listenBazaar, deleteBazaar, stopListening
  }
}
