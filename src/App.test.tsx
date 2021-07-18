import {mock as mockLocation} from "./__mocks__/location.mock.js";
import "./__mocks__/matchMedia.mock.js";

import React from "react";

import {
    findByText,
    fireEvent,
    getByText,
    getByTitle,
    prettyDOM,
    render,
    screen,
    waitFor
} from "@testing-library/react";
import App from "./App";
import {act} from "react-dom/test-utils";
import {v4 as uuid_v4} from "uuid";

const print = (element: HTMLElement) => console.log(prettyDOM(element))

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
    localStorage.setItem("DATABASE", JSON.stringify([]))
    render(<App/>)
    fireEvent.click(screen.getByText("Show History"))
})

it("has a name from url", async () => {
    mockLocation("http://localhost#eyJuYW1lIjoiVW5idWlsdCIsIlNQRUNJQUwiOnsiU1RSRU5HVEgiOjEsIlBFUkNFUFRJT07FD0VORFVSQU5DRcUOQ0hBUklTTUHFDUlOVEVMTElHRcgeQUdJTElUWcUMTFVDSyI6MX0sImxldmVsIjo1MCwiYm9iYmxlaGVhZHMiOltdLCJwZXJrxQt9")
    render(<App/>)

    const actual = screen.getByText("Unbuilt")
    expect(actual).toBeInTheDocument()
})

it("has a name from url", async () => {
    mockLocation("http://localhost#eyJuYW1lIjoiVW5idWlsdCIsIlNQRUNJQUwiOnsiU1RSRU5HVEgiOjEsIlBFUkNFUFRJT07FD0VORFVSQU5DRcUOQ0hBUklTTUHFDUlOVEVMTElHRcgeQUdJTElUWcUMTFVDSyI6MX0sImxldmVsIjo1MCwiYm9iYmxlaGVhZHMiOltdLCJwZXJrxQt9")
    render(<App/>)

    const actual = screen.getByText("Unbuilt")
    expect(actual).toBeInTheDocument()

})

it("can increment a stat", async () => {
    render(<App/>)

    const actual = screen.getAllByText("+")
    const sample = actual.reduce((a, b) => a)
    expect(sample).toBeInTheDocument()

    fireEvent.click(sample)
})

it("can increment and decrement a specific stat", () => {
    render(<App/>)

    const actual = screen.getByText(/PERCEPTION/)
    expect(actual).toBeInTheDocument()
    const {parentElement: parent} = actual

    expect(parent).toBeInTheDocument()
    if (parent == null) {
        fail()
    }

    const plus = getByText(parent!!, /\+/)
    expect(plus).toBeInTheDocument()

    fireEvent.click(plus)

    const value = getByTitle(parent!!, "PERCEPTION-value")
    expect(value).toBeInTheDocument()
    expect(value).toHaveTextContent("2")

    const minus = getByText(parent, /-/)
    expect(minus).toBeInTheDocument()

    waitFor(() => expect(value).toBe("1"))
})

it("has build history", async () => {
    const expected = {
        id: uuid_v4(),
        name: "History Buff",
        createdAt: new Date(),
        updatedAt: new Date()
    }
    localStorage.setItem("DATABASE", JSON.stringify([expected]))
    render(<App/>)

    const h3 = screen.getByText(/^History$/)
    expect(h3).toBeInTheDocument()

    const {parentElement: div} = h3.parentElement ?? {}
    expect(div).toBeInTheDocument()
    if (div == null) fail()

    const name = await findByText(div, expected.name)
    expect(name).toBeInTheDocument()

    const {parentElement: row} = name
    expect(row).toBeInTheDocument()
    if (row == null) fail()

    const id = await findByText(row, expected.id)
    expect(id).toBeInTheDocument()
})

it("can load a build", async () => {
    const expected = {
        id: uuid_v4(),
        name: "History Buff",
        createdAt: new Date(),
        updatedAt: new Date()
    }
    localStorage.setItem("DATABASE", JSON.stringify([expected]))
    render(<App/>)

    const h3 = screen.getByText(/^History$/)
    expect(h3).toBeInTheDocument()

    const {parentElement: div} = h3.parentElement ?? {}
    expect(div).toBeInTheDocument()
    if (div == null) fail()

    const name = await findByText(div, expected.name)
    expect(name).toBeInTheDocument()

    fireEvent.click(name)

    const buildName = await screen.findByTitle("BuildInfo-name")
    expect(buildName).toHaveTextContent(expected.name)
})
