import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AvailabilityInfoModal } from './availability-info-modal'
import { mockCandidates, mockEngineers } from '@/lib/mock-data'

// 1) Test candidate view:
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

  // pick one known slot and verify it’s formatted
  const slotOne = candidate.availability.Monday[0]
  const formatted = `${slotOne.start}–${slotOne.end}`
  expect(screen.getByText(formatted)).toBeInTheDocument()
})

// 2) Test engineers accordion and slot counts:
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
  const day = Object.keys(engineers[0].availability)[0]
  const times = engineers[0].availability[day][0]
  const formatted = `${times.start}–${times.end}`
  // Find the panel containing the day label, then search within for the formatted time
  const dayLabel = screen.getByText(new RegExp(`^${day}:?`))
  const panel = within(dayLabel.closest('div')!)
  expect(panel.getByText(formatted)).toBeInTheDocument()
})
