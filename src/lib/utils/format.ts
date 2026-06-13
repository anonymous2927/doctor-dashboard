import { format } from 'date-fns'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

export function formatDate(date: string | Date, pattern: string = 'PPP'): string {
  return format(new Date(date), pattern)
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const date = new Date()
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10))
  return format(date, 'h:mm a')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}
