export function getTodayBD() {
  const now = new Date()
  const bd = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }))
  return formatDate(bd)
}

export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getCurrentMonthKey() {
  const today = getTodayBD()
  return today.substring(0, 7) // "2025-06"
}

export function getDaysInMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const days = new Date(year, month, 0).getDate()
  const result = []
  for (let d = 1; d <= days; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    result.push(dateStr)
  }
  return result
}

export function isPastDate(dateStr) {
  const today = getTodayBD()
  return dateStr < today
}

export function isToday(dateStr) {
  return dateStr === getTodayBD()
}

export function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function banglaDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  const months = ['', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
  return `${parseInt(d)} ${months[parseInt(m)]} ${y}`
}

export function banglaMonthYear(monthKey) {
  const [y, m] = monthKey.split('-')
  const months = ['', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
  return `${months[parseInt(m)]} ${y}`
}

export function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return String(num).replace(/[0-9]/g, d => banglaDigits[d])
}

export function getDayName(dateStr) {
  const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']
  const d = new Date(dateStr)
  return days[d.getDay()]
}
