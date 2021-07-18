import "./__mocks__/matchMedia.mock.js";

import React from "react";

import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BuildHistoryModal from "./BuildHistoryModal";
import BuildContext, {Build, Metadata} from "./BuildContext";

describe("test BuildHistoryModal", () => {
    it("should render", () => {
        const setShow = jest.fn()
        render(
            <BuildContext.Provider value={{history: [] as Metadata[]} as Build}>
                <BuildHistoryModal show={true} setShow={setShow}/>
            </BuildContext.Provider>
        )

        const header = screen.getByText("Recent builds")
        expect(header).toBeInTheDocument()
        expect(header.className).toContain("modal-header")
    })

    it("should close when clicking outside the modal", () => {
        const setShow = jest.fn()
        render(
            <BuildContext.Provider value={{history: [] as Metadata[]} as Build}>
                <BuildHistoryModal show={true} setShow={setShow}/>
            </BuildContext.Provider>
        )

        userEvent.click(document.body)

        waitFor(() => {
            expect(setShow).toBeCalledWith(false)
            expect(setShow).not.toBeCalledWith(true)
            expect(setShow).toBeCalledTimes(1)
        })
    })
})
