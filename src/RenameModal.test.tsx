import "./__mocks__/matchMedia.mock.js";

import React from "react";

import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import RenameModal from "./RenameModal";
import BuildContext, {Build, useBuild} from "./BuildContext";
import userEvent from "@testing-library/user-event";

describe("test RenameModal", () => {
    it("should render", () => {
        const setShow = jest.fn()
        render(<RenameModal show={true} setShow={setShow}/>)

        const header = screen.getByText("Name your build!")
        expect(header).toBeInTheDocument()
        expect(header.className).toContain("modal-header")
    })

    it("should save and close", () => {
        const setShow = jest.fn()
        const save = jest.fn().mockImplementation(
            (_: string) => {
            }
        ) as (buildName: string) => void
        const name = "Fancy Pants"
        render(
            <BuildContext.Provider value={{name, save} as Build}>
                <RenameModal show={true} setShow={setShow}/>
            </BuildContext.Provider>
        )

        const button = screen.getByText("Save")
        expect(button).toBeInTheDocument()

        fireEvent.click(button)

        expect(save).toBeCalledWith(name)
        expect(save).not.toBeCalledWith("Something else")
        expect(save).toBeCalledTimes(1)

        expect(setShow).toBeCalledWith(false)
        expect(setShow).not.toBeCalledWith(true)
        expect(setShow).toBeCalledTimes(1)
    })

    it("should close when clicking outside the modal", () => {
        const setShow = jest.fn()
        render(<RenameModal show={true} setShow={setShow}/>)

        userEvent.click(document.body)

        waitFor(() => {
            expect(setShow).toBeCalledWith(false)
            expect(setShow).not.toBeCalledWith(true)
            expect(setShow).toBeCalledTimes(1)
        })
    })

    it("should change the name", () => {
        const setShow = jest.fn()
        render(<RenameModal show={true} setShow={setShow}/>)

        const actual = screen.getByTestId("RenameModal-name")
        expect(actual).toBeInTheDocument()
        expect(actual.tagName).toBe("INPUT")

        const name = "Fancy Pants"
        fireEvent.change(actual, {target: {value: name}})

        waitFor(() => expect(actual.nodeValue).toBe(name))
    })
})
