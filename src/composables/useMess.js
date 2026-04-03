import { db } from '../firebase/config'
import {
  doc, setDoc, getDoc, updateDoc,
  arrayUnion, arrayRemove, query,
  collection, where, getDocs
} from 'firebase/firestore'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'
import { generateInviteCode } from '../utils/helpers'

export function useMess() {
  const authStore = useAuthStore()
  const messStore = useMessStore()

  async function createMess(name) {
    const uid = authStore.user.uid
    const inviteCode = generateInviteCode()
    const messId = `mess_${uid}_${Date.now()}`
    const messData = {
      name,
      adminUid: uid,
      inviteCode,
      members: [uid],
      createdAt: new Date().toISOString()
    }
    await setDoc(doc(db, 'messes', messId), messData)
    await authStore.updateProfile({ messId })
    await messStore.loadMess(messId)
    return messId
  }

  async function joinMess(code) {
    const q = query(
      collection(db, 'messes'),
      where('inviteCode', '==', code.toUpperCase())
    )
    const snap = await getDocs(q)
    if (snap.empty) throw new Error('ভুল কোড! মেস পাওয়া যায়নি।')

    const messDoc = snap.docs[0]
    const messId = messDoc.id
    const uid = authStore.user.uid

    if (messDoc.data().members.includes(uid)) {
      throw new Error('আপনি ইতোমধ্যে এই মেসের সদস্য!')
    }

    await updateDoc(doc(db, 'messes', messId), {
      members: arrayUnion(uid)
    })
    await authStore.updateProfile({ messId })
    await messStore.loadMess(messId)
    return messId
  }

  async function removeMember(uid) {
    if (!messStore.mess) return
    const messId = messStore.mess.id
    await updateDoc(doc(db, 'messes', messId), {
      members: arrayRemove(uid)
    })
    await updateDoc(doc(db, 'users', uid), { messId: null })
    await messStore.loadMess(messId)
  }

  async function leaveMess() {
    const uid = authStore.user.uid
    const messId = authStore.userProfile.messId
    if (!messId) return
    await updateDoc(doc(db, 'messes', messId), {
      members: arrayRemove(uid)
    })
    await authStore.updateProfile({ messId: null })
    messStore.mess = null
    messStore.members = []
  }

  async function updateMessName(name) {
    if (!messStore.mess) return
    await updateDoc(doc(db, 'messes', messStore.mess.id), { name })
    messStore.mess.name = name
  }

  return { createMess, joinMess, removeMember, leaveMess, updateMessName }
}
