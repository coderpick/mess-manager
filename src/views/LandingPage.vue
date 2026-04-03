<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-500 to-teal-700 
    flex flex-col items-center justify-center p-6 text-white">
    <div class="text-center max-w-sm">
      <div class="text-7xl mb-4">🍽️</div>
      <h1 class="text-4xl font-bold mb-2">মেস ম্যানেজার</h1>
      <p class="text-teal-100 mb-8 text-lg">
        মেসের মিল, বাজার ও হিসাব — সব এক জায়গায়
      </p>

      <div class="space-y-3">
        <router-link to="/login" class="block w-full bg-white text-teal-700 
          py-3 rounded-2xl font-bold text-lg hover:bg-teal-50 transition shadow-lg">
          🚀 শুরু করুন
        </router-link>
      </div>

      <div class="mt-12 grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-3xl mb-1">📝</div>
          <p class="text-xs text-teal-100">মিল ইনপুট</p>
        </div>
        <div>
          <div class="text-3xl mb-1">🛒</div>
          <p class="text-xs text-teal-100">বাজার হিসাব</p>
        </div>
        <div>
          <div class="text-3xl mb-1">📊</div>
          <p class="text-xs text-teal-100">মাসিক রিপোর্ট</p>
        </div>
      </div>
    </div>
  </div>
</template>
