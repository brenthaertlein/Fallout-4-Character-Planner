import "./__mocks__/matchMedia.mock.js";

import React from "react";

import {render, screen} from "@testing-library/react";
import LevelControl from "./LevelControl";
import StatsContext, {Stats} from "./StatsContext";
import PerksContext, {Perks} from "./PerksContext";

describe("test LevelControl", () => {
    const construct = ({level = 1, perkPoints = 0}) => {
        const getLevel = jest.fn().mockImplementation(() => level) as () => number
        const setLevel = jest.fn() as (level: number) => void
        const pointsRemaining = jest.fn().mockImplementation(() => 0) as () => number
        const perkPointsRemaining = jest.fn().mockImplementation(() => perkPoints) as () => number
        const wrapper = render(
            <StatsContext.Provider value={{getLevel, pointsRemaining, setLevel} as Stats}>
                <PerksContext.Provider value={{perkPointsRemaining} as Perks}>
                    <LevelControl/>
                </PerksContext.Provider>
            </StatsContext.Provider>
        )
        return {
            wrapper,
            stats: {getLevel, setLevel, pointsRemaining} as Stats,
            perks: {perkPointsRemaining} as Perks
        }
    }

    it("renders", async () => {
        const {
            stats: {getLevel, pointsRemaining},
            perks: {perkPointsRemaining}
        } = construct({})

        const actual = await screen.getByText(/Requires\slevel:\W+1/)
        expect(actual).toBeInTheDocument()
        expect(perkPointsRemaining).toHaveBeenCalledTimes(1)
        expect(getLevel).toHaveBeenCalledTimes(4)
        expect(pointsRemaining).toHaveBeenCalledTimes(1)
    })
})
