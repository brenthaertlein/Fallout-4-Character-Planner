import "./__mocks__/matchMedia.mock.js";

import React from "react";

import {fireEvent, getByRole, prettyDOM, render, screen} from "@testing-library/react";
import PerksTower from "./PerksTower";
import StatsContext, {Stats} from "./StatsContext";
import PerksContext, {Perk, Perks} from "./PerksContext";

const print = (element: HTMLElement) => console.log(prettyDOM(element))

describe("test PerksTower", () => {
    it("renders", () => {
        const getRank = jest.fn().mockImplementation((name: string) => "1" ? 1 : 0) as (name: string) => number
        render(
            <StatsContext.Provider value={{getRank} as Stats}>
                <PerksTower/>
            </StatsContext.Provider>
        )

        const h3 = screen.getByText(/^Perks$/)
        expect(h3).toBeInTheDocument()
    })

    it("renders buttons", () => {
        const getRank = jest.fn().mockImplementation((name: string) => "1" ? 1 : 0) as (name: string) => number
        render(
            <StatsContext.Provider value={{getRank} as Stats}>
                <PerksTower/>
            </StatsContext.Provider>
        )

        const h3 = screen.getByText(/^Perks$/)
        expect(h3).toBeInTheDocument()
        const {parentElement: fragment} = h3
        expect(fragment).toBeInTheDocument()
        if (fragment === null) fail()
        const buttons = getByRole(fragment, "group")
        expect(buttons.childElementCount).toEqual(7)

        const sample = buttons.children.item(Math.floor(Math.random() * 7)) as HTMLElement
        expect(sample).toBeInTheDocument()
    })

    it("clicking a button shows perks for that stat", () => {
        const getRank = jest.fn().mockImplementation((name: string) => 0) as (name: string) => number
        const getPerk = jest.fn().mockImplementation((name: string) => undefined) as (name: String) => Perk | undefined
        render(
            <PerksContext.Provider value={{perks: [] as Perk[], getPerk} as Perks}>
                <StatsContext.Provider value={{getRank} as Stats}>
                    <PerksTower/>
                </StatsContext.Provider>
            </PerksContext.Provider>
        )

        const h3 = screen.getByText(/^Perks$/)
        expect(h3).toBeInTheDocument()
        const {parentElement: fragment} = h3
        expect(fragment).toBeInTheDocument()
        if (fragment === null) fail()
        const buttons = getByRole(fragment, "group")
        expect(buttons.childElementCount).toEqual(7)

        const sample = buttons.children.item(Math.floor(Math.random() * 7)) as HTMLElement
        expect(sample).toBeInTheDocument()
        if (sample === null) fail()
        // const category = sample.textContent
        fireEvent.click(sample)

    })
})
