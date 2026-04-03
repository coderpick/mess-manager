import { ref } from 'vue'
import { db } from '../firebase/config'
import {
  doc, setDoc, query, collection, where, getDocs, onSnapshot
} from 'firebase/firestore'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'
import { getTodayBD } from '../utils/helpers'

export function useMeals() {
  const authStore = useAuthStore()
  const messStore = useMessStore()
  const meals = ref({})
  const allMeals = ref([])
  const loading = ref(false)
  let unsubscribe = null

  function getMealDocId(userId, date) {
    return `${messStore.mess?.id}_${userId}_${date}`
  }

  async function saveMeal(date, breakfast, lunch, dinner, targetUid = null) {
    if (!messStore.mess) throw new Error('মেস ডাটা পাওয়া যায়নি। দয়া করে পেজ রিফ্রেশ করুন।')
    const uid = targetUid || authStore.user.uid
    const messId = messStore.mess.id
    const docId = getMealDocId(uid, date)
    const monthKey = date.substring(0, 7)
    const total = (breakfast || 0) + (lunch || 0) + (dinner || 0)

    await setDoc(doc(db, 'meals', docId), {
      messId,
      userId: uid,
      date,
      monthKey,
      breakfast: breakfast || 0,
      lunch: lunch || 0,
      dinner: dinner || 0,
      total,
      updatedAt: new Date().toISOString()
    })
  }

  function listenUserMeals(uid) {
    if (!messStore.mess || !uid) return
    const monthKey = messStore.selectedMonth

    if (unsubscribe) unsubscribe()

    const q = query(
      collection(db, 'meals'),
      where('messId', '==', messStore.mess.id),
      where('userId', '==', uid),
      where('monthKey', '==', monthKey)
    )

    loading.value = true
    unsubscribe = onSnapshot(q, (snap) => {
      const result = {}
      snap.forEach(d => {
        const data = d.data()
        result[data.date] = data
      })
      meals.value = result
      loading.value = false
    })
  }

  function listenAllMeals() {
    if (!messStore.mess) return
    const monthKey = messStore.selectedMonth

    if (unsubscribe) unsubscribe()

    const q = query(
      collection(db, 'meals'),
      where('messId', '==', messStore.mess.id),
      where('monthKey', '==', monthKey)
    )

    loading.value = true
    unsubscribe = onSnapshot(q, (snap) => {
      allMeals.value = snap.docs.map(d => d.data())
      loading.value = false
    })
  }

  async function getAllMealsOnce(monthKey) {
    if (!messStore.mess) return []
    const q = query(
      collection(db, 'meals'),
      where('messId', '==', messStore.mess.id),
      where('monthKey', '==', monthKey || messStore.selectedMonth)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data())
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  function getTodayTotalMeals(mealsData) {
    const today = getTodayBD()
    return mealsData
      .filter(m => m.date === today)
      .reduce((sum, m) => sum + (m.total || 0), 0)
  }

  return {
    meals, allMeals, loading,
    saveMeal, listenUserMeals, listenAllMeals,
    getAllMealsOnce, stopListening, getTodayTotalMeals
  }
}
