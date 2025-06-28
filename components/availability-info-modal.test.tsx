import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AvailabilityInfoModal } from './availability-info-modal'
import { mockCandidates, mockEngineers } from '@/lib/mock-data'
import { formatTime } from '@/lib/utils'

// TEST 1: Test candidate view:
test('shows candidate availability rows and correct time-ranges', () => {
  const candidate = mockCandidates[0]
  render(
    <AvailabilityInfoModal
      open={true}
      onClose={() => {}}
      type="candidate"
      candidate={candidate}
    />
  )

  // candidate name
  expect(screen.getByText(candidate.name)).toBeInTheDocument()

  // for each key in candidate.availability, we should see a row
  Object.keys(candidate.availability).forEach((day) => {
    // The day label may have a colon and possibly whitespace after it
    expect(screen.getByText(new RegExp(`^${day}:`))).toBeInTheDocument()
  })

  // pick one known slot and verify it's formatted
  const slotOne = candidate.availability.Monday[0]
  const formatted = `${formatTime(slotOne.start)}–${formatTime(slotOne.end)}`
  expect(screen.getByText(formatted)).toBeInTheDocument()
})

// TEST 2: Test engineers accordion and slot counts:
test('engineers view lists each engineer and their slots', async () => {
  const engineers = mockEngineers.slice(0, 2)
  render(
    <AvailabilityInfoModal
      open={true}
      onClose={() => {}}
      type="engineers"
      engineers={engineers}
    />
  )

  // Accordion headers should list names
  engineers.forEach((eng) => {
    expect(screen.getByText(eng.name)).toBeInTheDocument()
  })

  // expand first engineer
  const firstHeader = screen.getByText(engineers[0].name)
  await userEvent.click(firstHeader)

  // within its content, pick one day and time-range
  const day = Object.keys(engineers[0].availability)[0] as import("@/lib/types").DayOfWeek
  const times = engineers[0].availability[day][0]
  const formatted = `${formatTime(times.start)}–${formatTime(times.end)}`
  // Find the panel containing the day label, then search within for the formatted time
  const dayLabel = screen.getByText(new RegExp(`^${day}:?`))
  const panelDiv = dayLabel.closest('div')!
  // Wait for the formatted time to appear in any span inside the panel
  const matches = await screen.findAllByText((content, node) => {
    return !!(node?.tagName === 'SPAN' && (node as HTMLElement).textContent?.includes(formatted));
  });
  expect(matches.length).toBeGreaterThan(0);
})
