import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AvailabilityInfoModal } from '../availability-info-modal'
import { mockCandidates, mockEngineers } from '@/lib/mock-data'
import { formatTime } from '@/lib/utils'

// TEST 1: Test candidate availability modal view
// PSEUDO CODE:
// - Render modal with candidate data
// - Verify candidate name is displayed
// - Check that each day of availability is shown as a row
// - Validate that time ranges are properly formatted and displayed
test('displays candidate availability information with formatted time ranges', () => {
  const candidate = mockCandidates[0]
  render(
    <AvailabilityInfoModal
      open={true}
      onClose={() => {}}
      type="candidate"
      candidate={candidate}
    />
  )

  // Verify candidate name is displayed
  expect(screen.getByText(candidate.name)).toBeInTheDocument()

  // Check that each day of availability is shown as a row
  Object.keys(candidate.availability).forEach((day) => {
    // The day label may have a colon and possibly whitespace after it
    expect(screen.getByText(new RegExp(`^${day}:`))).toBeInTheDocument()
  })

  // Verify time ranges are properly formatted and displayed
  const slotOne = candidate.availability.Monday[0]
  const formatted = `${formatTime(slotOne.start)}–${formatTime(slotOne.end)}`
  expect(screen.getByText(formatted)).toBeInTheDocument()
})

// TEST 2: Test engineers accordion view with expandable content
// PSEUDO CODE:
// - Render modal with engineers data
// - Verify all engineer names appear as accordion headers
// - Click to expand first engineer's section
// - Check that availability details are displayed with proper formatting
test('displays engineers in accordion format with expandable availability details', async () => {
  const engineers = mockEngineers.slice(0, 2)
  render(
    <AvailabilityInfoModal
      open={true}
      onClose={() => {}}
      type="engineers"
      engineers={engineers}
    />
  )

  // Verify all engineer names appear as accordion headers
  engineers.forEach((eng) => {
    expect(screen.getByText(eng.name)).toBeInTheDocument()
  })

  // Expand first engineer's section to reveal availability details
  const firstHeader = screen.getByText(engineers[0].name)
  await userEvent.click(firstHeader)

  // Verify availability details are displayed with proper formatting
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

// TEST 3: Test modal close button functionality
// PSEUDO CODE:
// - Render modal with mock close handler
// - Find and click the close button
// - Verify the close handler is called exactly once
test('triggers onClose callback when close button is clicked', async () => {
  const mockOnClose = jest.fn()
  render(
    <AvailabilityInfoModal
      open={true}
      onClose={mockOnClose}
      type="candidate"
      candidate={mockCandidates[0]}
    />
  )

  const closeButton = screen.getByRole('button', { name: /close/i })
  await userEvent.click(closeButton)

  expect(mockOnClose).toHaveBeenCalledTimes(1)
})

// TEST 4: Test modal visibility when closed
// PSEUDO CODE:
// - Render modal with open=false
// - Verify that modal content is not visible in the DOM
test('hides modal content when open prop is set to false', () => {
  render(
    <AvailabilityInfoModal
      open={false}
      onClose={() => {}}
      type="candidate"
      candidate={mockCandidates[0]}
    />
  )

  // Modal content should not be visible when closed
  expect(screen.queryByText(mockCandidates[0].name)).not.toBeInTheDocument()
})
