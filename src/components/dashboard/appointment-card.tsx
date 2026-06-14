'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDate, formatTime, getInitials } from '@/lib/utils/format'
import type { Appointment } from '@/types'
import { CalendarDays, Clock, Video, PhoneCall, MessageCircle, Check, X } from 'lucide-react'

interface AppointmentCardProps {
  appointment: Appointment
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  onComplete?: (id: string) => void
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  pending: 'warning',
  confirmed: 'default',
  completed: 'success',
  cancelled: 'destructive',
  rejected: 'destructive',
  rescheduled: 'secondary',
}

const typeIcons = {
  video: Video,
  audio: PhoneCall,
  chat: MessageCircle,
}

export function AppointmentCard({ appointment, onAccept, onReject, onComplete }: AppointmentCardProps) {
  const TypeIcon = typeIcons[appointment.consultation_type] || Video

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border-2 border-emerald-100 dark:border-emerald-900/30">
            <AvatarFallback className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-medium">
              {getInitials(appointment.patient_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-sm truncate">{appointment.patient_name}</h4>
              <Badge variant={statusVariants[appointment.status] || 'default'}>
                {appointment.status}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(appointment.appointment_date, 'MMM dd, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(appointment.appointment_time)}
              </span>
              <span className="flex items-center gap-1">
                <TypeIcon className="h-3.5 w-3.5" />
                {appointment.consultation_type}
              </span>
            </div>
            {appointment.symptoms && (
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">{appointment.symptoms}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {appointment.status === 'pending' && (
                <>
                  {onAccept && (
                    <Button size="sm" variant="default" className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => onAccept(appointment.appointment_id)}>
                      <Check className="h-3 w-3" /> Accept
                    </Button>
                  )}
                  {onReject && (
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => onReject(appointment.appointment_id)}>
                      <X className="h-3 w-3" /> Reject
                    </Button>
                  )}
                </>
              )}
              {appointment.status === 'confirmed' && onComplete && (
                <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => onComplete(appointment.appointment_id)}>
                  <Check className="h-3 w-3" /> Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
