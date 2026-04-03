import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db, googleProvider } from '../firebase/config'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userProfile = ref(null)
  const loading = ref(true)

  function init() {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        loading.value = false
        resolve()
      }, 5000)
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser
          try {
            await loadProfile()
          } catch (e) {
            console.error('Profile load error:', e)
          }
        } else {
          user.value = null
          userProfile.value = null
        }
        clearTimeout(timeout)
        loading.value = false
        resolve()
      })
    })
  }

  async function loadProfile() {
    if (!user.value) return
    const docRef = doc(db, 'users', user.value.uid)
    try {
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        userProfile.value = { id: snap.id, ...snap.data() }
      } else {
        const profile = {
          name: user.value.displayName || '',
          email: user.value.email || '',
          photoURL: user.value.photoURL || '',
          messId: null,
          createdAt: new Date().toISOString()
        }
        await setDoc(docRef, profile)
        userProfile.value = { id: user.value.uid, ...profile }
      }
    } catch (e) {
      console.error('Firestore Error in loadProfile:', e)
      throw e
    }
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    user.value = result.user
    await loadProfile()
  }

  async function logout() {
    await signOut(auth)
    user.value = null
    userProfile.value = null
  }

  async function updateProfile(data) {
    if (!user.value) return
    const docRef = doc(db, 'users', user.value.uid)
    await setDoc(docRef, data, { merge: true })
    userProfile.value = { ...userProfile.value, ...data }
  }

  return {
    user, userProfile, loading,
    init, loadProfile, loginWithGoogle, logout, updateProfile
  }
})
