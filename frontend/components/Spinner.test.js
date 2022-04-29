// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from "./Spinner"
import React from "react"
import { render } from "@testing-library/react"

test('sanity', () => {
  expect(true).toBe(true)
})

it('renders Spinner without crashing', () => {
  render(<Spinner />)
})

it("When Spinner On is True. Spinner is truthy", () => {
  render(<Spinner on={true} />)

  const spinner = document.querySelector("#spinner")
  
  expect(spinner).toBeTruthy()

})

it("When Spinner On is False, Spinner is Falsy", () => {
  render(<Spinner on={false} />)

  const spinner = document.querySelector("#spinner")
  
  expect(spinner).toBeFalsy()

})