import { manualSum } from '../../../src/services/temp.service'

test('adds 1 + 2 to equal 3', () => {
  expect(manualSum(1, 2)).toBe(3)
})

test('adds 1 + 2 to equal 3 (neg)', () => {
  expect(manualSum(1, 2)).toBe(4)
})
