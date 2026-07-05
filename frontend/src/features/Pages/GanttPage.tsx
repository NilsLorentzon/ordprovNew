import React, { useEffect, useMemo, useState } from 'react'

type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

type Chore = {
  id: string
  title: string
  frequency: Frequency
  weekday?: number // 0-6 for weekly
  dayOfMonth?: number // 1-31 for monthly
  monthDay?: { month: number; day: number } // for yearly: month 0-11
  assignedTo?: string
}

const STORAGE_KEY = 'household.choreState.v1'

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function addDays(d: Date, days: number) {
  const n = new Date(d)
  n.setDate(n.getDate() + days)
  return n
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

const defaultMembers = ['Alice', 'Bob']

const DEFAULT_CHORES: Chore[] = [
  // Daily
  { id: 'd-wash-dishes', title: 'Wash dishes', frequency: 'daily', assignedTo: 'Alice' },
  { id: 'd-make-bed', title: 'Make bed', frequency: 'daily', assignedTo: 'Bob' },
  { id: 'd-tidy-living', title: 'Tidy living room', frequency: 'daily', assignedTo: 'Shared' },
  { id: 'd-feed-plants', title: 'Water plants', frequency: 'daily', assignedTo: 'Alice' },
  // Weekly
  { id: 'w-vacuum', title: 'Vacuum apartment', frequency: 'weekly', weekday: 6, assignedTo: 'Bob' },
  { id: 'w-change-sheets', title: 'Change bed sheets', frequency: 'weekly', weekday: 0, assignedTo: 'Alice' },
  { id: 'w-clean-bath', title: 'Clean bathroom', frequency: 'weekly', weekday: 6, assignedTo: 'Bob' },
  { id: 'w-trash', title: 'Take out trash', frequency: 'weekly', weekday: 5, assignedTo: 'Alice' },
  // Monthly
  { id: 'm-clean-fridge', title: 'Clean fridge', frequency: 'monthly', dayOfMonth: 1, assignedTo: 'Bob' },
  { id: 'm-pay-bills', title: 'Pay bills / rent', frequency: 'monthly', dayOfMonth: 1, assignedTo: 'Alice' },
  { id: 'm-windows', title: 'Clean windows', frequency: 'monthly', dayOfMonth: 15, assignedTo: 'Shared' },
  // Yearly
  { id: 'y-declutter', title: 'Declutter closet', frequency: 'yearly', monthDay: { month: 6, day: 1 }, assignedTo: 'Shared' },
  { id: 'y-deep-oven', title: 'Deep clean oven', frequency: 'yearly', monthDay: { month: 0, day: 1 }, assignedTo: 'Shared' },
  { id: 'y-battery', title: 'Replace smoke detector batteries', frequency: 'yearly', monthDay: { month: 9, day: 1 }, assignedTo: 'Shared' },
]

export default function Household() {
  const [members, setMembers] = useState<string[]>(defaultMembers)
  const [today, setToday] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedMember, setSelectedMember] = useState<string>('All')
  const [loaded, setLoaded] = useState(false)

  // persisted state: completed map and postponed map and chore assignments
  const [completed, setCompleted] = useState<Record<string, string[]>>({})
  const [postponedTo, setPostponedTo] = useState<Record<string, string[]>>({})
  const [chores, setChores] = useState<Chore[]>(DEFAULT_CHORES)

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setMembers(parsed.members ?? defaultMembers)
        setCompleted(parsed.completed ?? {})
        setPostponedTo(parsed.postponedTo ?? {})
        setChores(parsed.chores ?? DEFAULT_CHORES)
        setSelectedMember(parsed.selectedMember ?? 'All')
      }
      setLoaded(true)
    } catch (e) {
      // ignore
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!loaded) return
    const payload = { members, completed, postponedTo, chores, selectedMember }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (e) {
      // ignore quota errors
    }
  }, [members, completed, postponedTo, chores, selectedMember, loaded])

  function isChoreScheduledOn(chore: Chore, date: Date) {
    const weekday = date.getDay()
    const day = date.getDate()
    const month = date.getMonth()
    if (chore.frequency === 'daily') return true
    if (chore.frequency === 'weekly') return chore.weekday === weekday
    if (chore.frequency === 'monthly') return chore.dayOfMonth === day
    if (chore.frequency === 'yearly') return chore.monthDay?.month === month && chore.monthDay?.day === day
    return false
  }

  function choresForDate(date: Date) {
    const dateKey = formatDate(date)
    const base = chores.filter((c) => isChoreScheduledOn(c, date))
    const postponed = postponedTo[dateKey] ?? []
    const postponedChores = chores.filter((c) => postponed.includes(c.id))
    // Avoid duplicates
    const all = [...base, ...postponedChores]
    const uniq = all.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i)
    if (selectedMember === 'All') return uniq
    if (selectedMember === 'Shared') return uniq.filter((c) => (c.assignedTo ?? 'Shared') === 'Shared')
    return uniq.filter((c) => (c.assignedTo ?? 'Shared') === selectedMember)
  }

  function toggleDone(choreId: string, date: Date) {
    const k = formatDate(date)
    setCompleted((prev) => {
      const list = new Set(prev[choreId] ?? [])
      const key = k
      if (list.has(key)) list.delete(key)
      else list.add(key)
      return { ...prev, [choreId]: Array.from(list) }
    })
  }

  function postpone(choreId: string, date: Date) {
    const from = formatDate(date)
    const next = formatDate(addDays(date, 1))
    setPostponedTo((prev) => {
      const nextList = new Set(prev[next] ?? [])
      nextList.add(choreId)
      // also remove any postponed marker from 'from' if present
      const fromList = new Set(prev[from] ?? [])
      fromList.delete(choreId)
      const copy = { ...prev, [next]: Array.from(nextList) }
      if (fromList.size) copy[from] = Array.from(fromList)
      else delete copy[from]
      return copy
    })
    // also uncheck if was checked for original date
    setCompleted((prev) => {
      const copy = { ...prev }
      const arr = (copy[choreId] ?? []).filter((d) => d !== from)
      copy[choreId] = arr
      return copy
    })
  }

  const monthMatrix = useMemo(() => {
    const start = startOfMonth(selectedDate)
    const end = endOfMonth(selectedDate)
    const startWeekday = start.getDay()
    const days: (Date | null)[] = []
    for (let i = 0; i < startWeekday; i++) days.push(null)
    for (let d = 1; d <= end.getDate(); d++) days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d))
    while (days.length % 7 !== 0) days.push(null)
    const weeks: (Date | null)[][] = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
    return weeks
  }, [selectedDate, chores, postponedTo, completed])

  function changeMemberName(index: number, name: string) {
    setMembers((prev) => {
      const old = prev[index]
      const next = prev.map((x, i) => (i === index ? name : x))
      // also update any chores assigned to the old name
      setChores((cs) => cs.map((c) => (c.assignedTo === old ? { ...c, assignedTo: name } : c)))
      return next
    })
  }

  function changeAssigned(choreId: string, name: string) {
    setChores((prev) => prev.map((c) => (c.id === choreId ? { ...c, assignedTo: name } : c)))
  }

  function clearMonth() {
    if (!confirm('Clear all completed and postponed data for this month?')) return
    const start = startOfMonth(selectedDate)
    const end = endOfMonth(selectedDate)
    const keysToRemove = new Set<string>()
    for (let d = new Date(start); d <= end; d = addDays(d, 1)) keysToRemove.add(formatDate(d))
    setCompleted((prev) => {
      const out: Record<string, string[]> = {}
      for (const [choreId, dates] of Object.entries(prev)) {
        out[choreId] = dates.filter((dt) => !keysToRemove.has(dt))
      }
      return out
    })
    setPostponedTo((prev) => {
      const out: Record<string, string[]> = {}
      for (const [dt, list] of Object.entries(prev)) if (!keysToRemove.has(dt)) out[dt] = list
      return out
    })
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 18 }}>
      <style>{`
        .pink-page { background: linear-gradient(180deg,#fff0f6 0%, #fffaf8 100%); border-radius: 12px; padding: 16px }
        .accent { color: #ff6fa3 }
        .btn { background: #ff6fa3; color: white; border-radius: 8px; padding: 6px 10px; border: none }
        .cell { border-radius: 8px; padding: 8px; cursor: pointer }
        .cell:hover { background: #ffe6f0 }
        .today { box-shadow: inset 0 0 0 2px #ffb2d0 }
        .checked { text-decoration: line-through; opacity: 0.7 }
      `}</style>
      <div className="pink-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0 }} className="accent">Household Chores</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn" onClick={() => setSelectedDate(addDays(selectedDate, -30))}>◀</button>
            <div style={{ minWidth: 220, textAlign: 'center', fontWeight: 600 }}>
              {selectedDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
            </div>
            <button className="btn" onClick={() => setSelectedDate(addDays(selectedDate, 30))}>▶</button>
            <button style={{ background: '#fff', border: '1px solid #ffb6cc', color: '#ff3b8f', borderRadius: 8, padding: '6px 10px' }} onClick={() => setSelectedDate(new Date())}>Today</button>
            <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} style={{ marginLeft: 8, padding: 6, borderRadius: 8 }}>
              <option value="All">All</option>
              {members.map((m) => <option key={m} value={m}>{m}</option>)}
              <option value="Shared">Shared</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <div style={{ width: 560 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 6 }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => <div key={d} style={{ textAlign: 'center', fontSize: 12, color: '#a63b6e' }}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {monthMatrix.map((week, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
                  {week.map((day, j) => {
                    if (!day) return <div key={j} />
                    const key = formatDate(day)
                    const scheduled = choresForDate(day)
                    return (
                      <div key={j} className={`cell ${formatDate(today) === key ? 'today' : ''}`} onClick={() => setSelectedDate(day)} style={{ minHeight: 72, border: '1px solid rgba(255,90,140,0.12)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: 13, padding: 6 }}>{day.getDate()}</div>
                          <div style={{ fontSize: 11, padding: 6, color: '#ff6fa3' }}>{scheduled.length}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: 6 }}>
                          {scheduled.slice(0,4).map((c) => <div key={c.id} style={{ background: c.assignedTo === members[0] ? '#ffd4e6' : c.assignedTo === members[1] ? '#ffecec' : '#fff0f6', color: '#9b2a52', borderRadius: 6, padding: '2px 6px', fontSize: 11 }}>{c.title}</div>)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, color: '#a31b53' }}>{selectedDate.toDateString()}</div>
                <div style={{ fontSize: 12, color: '#6b2437' }}>{choresForDate(selectedDate).length} chores</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => clearMonth()}>Clear month</button>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              {choresForDate(selectedDate).map((c) => {
                const done = (completed[c.id] ?? []).includes(formatDate(selectedDate))
                const postponed = (postponedTo[formatDate(selectedDate)] ?? []).includes(c.id)
                return (
                  <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 8, borderRadius: 8, background: '#fff', marginBottom: 8 }}>
                    <input id={c.id} type="checkbox" checked={done} onChange={() => toggleDone(c.id, selectedDate)} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 600 }} className={done ? 'checked' : ''}>{c.title}</div>
                        <div style={{ fontSize: 12, color: '#b04a73' }}>{c.frequency}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                        <select value={c.assignedTo} onChange={(e) => changeAssigned(c.id, e.target.value)} style={{ padding: '6px', borderRadius: 6 }}>
                          {[...members, 'Shared'].map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <button onClick={() => postpone(c.id, selectedDate)} style={{ background: '#fff', border: '1px solid #ffd3e6', color: '#ff6fa3', padding: '6px 8px', borderRadius: 6 }}>Postpone 1d</button>
                        {postponed && <span style={{ color: '#9b2a52', fontSize: 13 }}>Postponed here</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
              {choresForDate(selectedDate).length === 0 && <div style={{ padding: 16, background: '#fff', borderRadius: 8 }}>No chores scheduled</div>}
            </div>

            <div style={{ marginTop: 18 }}>
              <h4 style={{ margin: '8px 0', color: '#a31b53' }}>Household members</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                {members.map((m, i) => (
                  <input key={i} value={m} onChange={(e) => changeMemberName(i, e.target.value)} style={{ padding: 8, borderRadius: 8 }} />
                ))}
                <button onClick={() => setMembers((s) => [...s, `Person ${s.length + 1}`])} style={{ padding: 8, borderRadius: 8, background: '#fff', border: '1px solid #ffd3e6', color: '#ff6fa3' }}>Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
