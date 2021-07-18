import React, {useState} from "react";

export type SPECIAL = {
    STRENGTH: number,
    PERCEPTION: number,
    ENDURANCE: number,
    CHARISMA: number,
    INTELLIGENCE: number,
    AGILITY: number,
    LUCK: number
}

export type Stats = {
    SPECIAL: SPECIAL,
    setSpecial: (special: SPECIAL) => void,
    increment: (stat: string) => void,
    decrement: (stat: string) => void,
    reset: () => void,
    pointsRemaining: () => number,
    getRank: (stat: string) => number,
    getLevel: () => number,
    setLevel: (level: number) => void,
    getBobbleHeads: () => StatType[],
    bobbleToggle: (stat: StatType) => void,
    hasBobblehead: (stat: string) => boolean
}

export enum StatType {
    STRENGTH = "STRENGTH", PERCEPTION = "PERCEPTION", ENDURANCE = "ENDURANCE", CHARISMA = "CHARISMA", INTELLIGENCE = "INTELLIGENCE", AGILITY = "AGILITY", LUCK = "LUCK"
}

export const DEFAULT_SPECIAL = Object.keys(StatType).reduce((obj, key) => {
    obj[key] = 1
    return obj
}, {} as any) as SPECIAL

const MAX_POINTS = 28

export const useStats = ({
                             SPECIAL: special = DEFAULT_SPECIAL,
                             level: initialLevel = 50,
                             bobbleheads: savedBobbleheads = []
                         }: { SPECIAL?: SPECIAL, level?: number, bobbleheads: [] }): Stats => {
    const [SPECIAL, setSpecial] = useState<SPECIAL>(special)
    const [level, setLevel] = useState(initialLevel)
    const [bobbleheads, setBobbleheads] = useState<StatType[]>(savedBobbleheads)

    const changeValue = (stat: string, value: number) => {
        const target = getRank(stat);
        setSpecial({
            ...SPECIAL,
            [stat]: Math.min(Math.max(target + value, 1), bobbleheads.findIndex(it => it === stat) >= 0 ? 11 : 10)
        })
    }

    const increment = (stat: string) => {
        changeValue(stat, 1)
    }

    const decrement = (stat: string) => changeValue(stat, -1)

    const pointsRemaining = () => {
        const pointsUsed = Object.values(SPECIAL).reduce((a, b) => a + Math.min(b, 11), 0) - bobbleheads.length
        return Math.max(0, MAX_POINTS - pointsUsed)
    }

    const getRank = (stat: string): number => (SPECIAL as any)[stat]

    const reset = () => {
        setSpecial(DEFAULT_SPECIAL)
        setBobbleheads([])
    }

    const bobbleToggle = (stat: StatType) => {
        const found = bobbleheads.findIndex(it => it === stat)
        if (found < 0) {
            bobbleheads.push(stat)
            increment(stat)
        } else {
            bobbleheads.splice(found, 1)
            decrement(stat)
        }
        setBobbleheads([...bobbleheads])
    }

    return {
        SPECIAL,
        setSpecial,
        increment,
        decrement,
        reset,
        pointsRemaining,
        getRank,
        getLevel: () => level,
        setLevel: (level: number) => setLevel(Math.min(level, 50)),
        getBobbleHeads: () => bobbleheads,
        bobbleToggle,
        hasBobblehead: (stat: string) => !!bobbleheads.find(it => it === stat),
    } as Stats;
}

const StatsContext = React.createContext<Stats>({SPECIAL: DEFAULT_SPECIAL} as Stats)

export default StatsContext
