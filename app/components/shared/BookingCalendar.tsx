'use client'

import { useMemo, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi'
import styles from './BookingCalendar.module.css'

export interface BookingSlot {
  /** ISO date (no time) of the chosen day. */
  iso: string
  /** Human label, e.g. "Tuesday, June 3". */
  label: string
  /** Chosen time slot, e.g. "11:00 AM". */
  time: string
}

interface BookingCalendarProps {
  firstName?: string
  isSubmitting?: boolean
  onConfirm: (slot: BookingSlot) => void
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const TIME_SLOTS = ['09:30 AM', '11:00 AM', '01:00 PM', '03:00 PM', '04:30 PM']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export default function BookingCalendar({ firstName, isSubmitting, onConfirm }: BookingCalendarProps) {
  // `today` is stable for the component's lifetime (client-only — modal is 'use client').
  const today = useMemo(() => startOfDay(new Date()), [])
  // First actually-bookable day (today onward, skipping Sundays). The calendar
  // opens on THIS month so the visitor never lands on an all-greyed-out month
  // (e.g. opening on the 31st, a Sunday, would otherwise show an empty month).
  const firstBookable = useMemo(() => {
    const d = new Date(today)
    while (d.getDay() === 0) d.setDate(d.getDate() + 1)
    return d
  }, [today])
  const minMonth = useMemo(
    () => new Date(firstBookable.getFullYear(), firstBookable.getMonth(), 1),
    [firstBookable]
  )
  const [view, setView] = useState(() => new Date(minMonth))
  const [selDate, setSelDate] = useState<Date | null>(null)
  const [selTime, setSelTime] = useState<string | null>(null)

  const firstDow = new Date(view.getFullYear(), view.getMonth(), 1).getDay()
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()

  // Don't let the user page back before the first bookable month.
  const atMinMonth =
    view.getFullYear() === minMonth.getFullYear() && view.getMonth() === minMonth.getMonth()

  const cells: Array<Date | null> = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d))

  const stepMonth = (delta: number) => {
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1))
  }

  const isDisabled = (d: Date) => d < today || d.getDay() === 0 // past days + Sundays

  const pickDay = (d: Date) => {
    if (isDisabled(d)) return
    setSelDate(d)
    setSelTime(null) // re-pick time when the day changes
  }

  const confirm = () => {
    if (!selDate || !selTime) return
    const label = selDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    onConfirm({ iso: startOfDay(selDate).toISOString(), label, time: selTime })
  }

  return (
    <div className={styles.cal}>
      <div className={styles.head}>
        <h2 className={styles.title}>
          {firstName ? `Pick a time, ${firstName}` : 'Pick a time'}
        </h2>
        <p className={styles.sub}>30-min live walkthrough · Google Meet</p>
      </div>

      {/* Month switcher */}
      <div className={styles.monthRow}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => stepMonth(-1)}
          disabled={atMinMonth}
          aria-label="Previous month"
        >
          <FiChevronLeft size={16} />
        </button>
        <span className={styles.monthLabel}>
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => stepMonth(1)}
          aria-label="Next month"
        >
          <FiChevronRight size={16} />
        </button>
      </div>

      {/* Weekday header */}
      <div className={styles.grid}>
        {WEEKDAYS.map((w) => (
          <span key={w} className={styles.dow}>{w}</span>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <span key={`b${i}`} className={styles.empty} />
          ) : (
            <button
              key={d.toISOString()}
              type="button"
              className={styles.day}
              disabled={isDisabled(d)}
              data-selected={selDate && sameDay(d, selDate) ? 'true' : 'false'}
              data-today={sameDay(d, today) ? 'true' : 'false'}
              onClick={() => pickDay(d)}
            >
              {d.getDate()}
            </button>
          )
        )}
      </div>

      {/* Time slots — appear once a day is chosen */}
      {selDate && (
        <div className={styles.times}>
          <div className={styles.timesLabel}>
            {selDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <div className={styles.timeWrap}>
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                type="button"
                className={styles.timeBtn}
                data-selected={selTime === t ? 'true' : 'false'}
                onClick={() => setSelTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.confirm}
        disabled={!selDate || !selTime || isSubmitting}
        onClick={confirm}
      >
        {selDate && selTime ? <>Confirm {selTime} <FiArrowRight size={16} /></> : 'Select a date & time'}
      </button>
    </div>
  )
}
