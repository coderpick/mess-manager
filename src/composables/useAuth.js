import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useMessStore } from '../stores/messStore'

export function useAuth() {
  const authStore = useAuthStore()
  const messStore = useMessStore()

  const isLoggedIn = computed(() => !!authStore.user)
  const hasMess = computed(() => !!authStore.userProfile?.messId)
  const isAdmin = computed(() =>
    messStore.mess?.adminUid === authStore.user?.uid
  )
  const uid = computed(() => authStore.user?.uid)

  return { isLoggedIn, hasMess, isAdmin, uid, authStore, messStore }
}
