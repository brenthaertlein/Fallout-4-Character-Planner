import "./__mocks__/matchMedia.mock.js";

import React from "react";

import {fireEvent, getByText, getByTitle, prettyDOM, render, screen} from "@testing-library/react";
import BuildContext, {Build, Metadata} from "./BuildContext";
import BuildHistory from "./BuildHistory";
import {v4 as uuid_v4} from "uuid";

describe("test BuildHistory", () => {
    const construct = () => {
        const data = {
            id: uuid_v4(),
            name: "A Build Worth Naming",
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const history = [data] as Metadata[]

        const remove = jest.fn() as (id: string) => void
        const removeAll = jest.fn() as () => void

        const wrapper = render(
            <BuildContext.Provider value={{history, remove, removeAll} as Build}>
                <BuildHistory/>
            </BuildContext.Provider>
        )

        return {
            wrapper,
            data,
            build: {history, remove, removeAll}
        }
    }

    const parentOf = (element: HTMLElement): HTMLElement => {
        const {parentElement} = element
        expect(parentElement).toBeInTheDocument()
        if (parentElement === null) fail()
        return parentElement
    }

    it("should render with history present", async () => {
        construct()

        const h3 = screen.getByText(/^History$/)
        expect(h3).toBeInTheDocument()
        expect(h3.tagName).toBe("H3")
    })

    it("should have rows with history present", async () => {
        const {build: {history}} = construct()

        const list = screen.getByTitle("BuildHistory-list")
        expect(list).toBeInTheDocument()
        expect(list.childElementCount).toEqual(history.length)
    })

    it("should have a row with expected data", async () => {
        const {data} = construct()

        const h3 = screen.getByText(/^History$/)
        expect(h3).toBeInTheDocument()
        expect(h3.tagName).toBe("H3")

        const container = parentOf(parentOf(h3))

        const name = await getByText(container, data.name)
        expect(name).toBeInTheDocument()

        const div = parentOf(name)

        const id = await getByText(div, data.id)
        expect(id).toBeInTheDocument()
    })

    it("should prompt user when Clear History button is clicked", async () => {
        construct()

        const h3 = screen.getByText(/^History$/)
        expect(h3).toBeInTheDocument()
        expect(h3.tagName).toBe("H3")

        const text = screen.getByText(/^Clear\shistory$/)
        expect(text).toBeInTheDocument()

        const x = getByTitle(h3, "removeAll")
        expect(x).toBeInTheDocument()
        if (x === null) fail()

        fireEvent.click(x)

        const altText = screen.getByText(/^Are you sure you want to remove all items\?$/)
        expect(altText).toBeInTheDocument()
    })

    it("should Clear History when button is clicked to confirm", async () => {
        const {build: {removeAll}} = construct()

        const h3 = screen.getByText(/^History$/)
        expect(h3).toBeInTheDocument()
        expect(h3.tagName).toBe("H3")

        const text = screen.getByText(/^Clear\shistory$/)
        expect(text).toBeInTheDocument()

        const x = getByTitle(h3, "removeAll")
        expect(x).toBeInTheDocument()
        if (x === null) fail()

        fireEvent.click(x)

        const altText = screen.getByText(/^Are you sure you want to remove all items\?$/)
        expect(altText).toBeInTheDocument()

        fireEvent.click(getByTitle(h3, "removeAll"))

        expect(altText).not.toBeInTheDocument()

        expect(removeAll).toHaveBeenCalledTimes(1)
    })

    it("should remove a row when button is clicked to confirm", async () => {
        const {data, build: {remove}} = construct()

        const h3 = screen.getByText(/^History$/)
        expect(h3).toBeInTheDocument()
        expect(h3.tagName).toBe("H3")

        const container = parentOf(parentOf(h3))

        const name = await getByText(container, data.name)
        expect(name).toBeInTheDocument()

        const row = parentOf(parentOf(name))

        const text = getByText(row, /^Last\sUpdated:\W+/)
        expect(text).toBeInTheDocument()
        expect(text).toHaveTextContent(`Last Updated: ${data.updatedAt.toISOString()}`)

        const x = getByTitle(row, "remove")
        expect(x).toBeInTheDocument()
        if (x === null) fail()

        fireEvent.click(x)

        const altText = screen.getByText(/^Are you sure you want to remove this item\?$/)
        expect(altText).toBeInTheDocument()

        fireEvent.click(getByTitle(row, "remove"))

        expect(altText).not.toBeInTheDocument()

        expect(remove).toHaveBeenCalledTimes(1)
    })
})
