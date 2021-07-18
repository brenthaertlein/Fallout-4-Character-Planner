import "./__mocks__/matchMedia.mock.js";

import React from "react";

import {fireEvent, render, screen} from "@testing-library/react";
import App from "./App";
import {act} from "react-dom/test-utils";

it("renders S.P.E.C.I.A.L. in h3", () => {
    act(() => {
        const {getByText} = render(<App/>);
        const actual = getByText("S.P.E.C.I.A.L.")
        expect(actual).toBeInTheDocument()
        expect(actual.tagName).toBe("H3")
    })
})

it("renders Fallout 4 Character Planner in Navbar.Brand", () => {
    act(() => {
        const {getByText} = render(<App/>);
        const actual = getByText("Fallout 4 Character Planner")
        expect(actual).toBeInTheDocument()
        expect(actual.tagName).toBe("SPAN")
        expect(actual.parentElement).toBeInTheDocument()
        expect(actual.parentElement?.className).toContain("navbar-brand")
    })
})

it("randomizes", async () => {
    render(<App/>)
    fireEvent.click(screen.getByText("Randomize"))

    const actual = await screen.getByText("Remaining perk points: 0")
    expect(actual).toBeInTheDocument()
})

it("resets", async () => {
    render(<App/>)
    fireEvent.click(screen.getByText("Randomize"))
    fireEvent.click(screen.getByText("Reset"))

    const actual = await screen.getByText("Remaining perk points: 49")
    expect(actual).toBeInTheDocument()
})

it("creates a new build", async () => {
    render(<App/>)
    fireEvent.click(screen.getByText("Randomize"))
    fireEvent.click(screen.getByText("New"))

    const actual = await screen.getByText("Remaining perk points: 49")
    expect(actual).toBeInTheDocument()
})

it("opens save modal", async () => {
    render(<App/>)
    fireEvent.click(screen.getByText("Save"))
})

it("opens share modal", async () => {
    render(<App/>)
    fireEvent.click(screen.getByText("Share"))
})

it("opens history modal", async () => {
    render(<App/>)
    fireEvent.click(screen.getByText("Save"))
})
