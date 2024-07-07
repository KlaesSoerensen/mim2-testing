import OnScreenKeyboard from "./OnScreenKeyboard";
import { createSignal, onCleanup } from "solid-js";
import { createListener, removeListener } from "../ts/events";
import { css } from '@emotion/css';

interface PlacementTestProps {
    /**
     * The sequence of keys to be pressed.
     * @default [{l: 'f', r: 'j'}, {l: "d", r: "k"}, {l: "s", r: "l"}]
     */
    sequence?: {l: string, r: string}[],
    maxDelayMs?: number
}

const generateSequence = (): {l: string, r: string}[] => {
    const sequence = [{l: 'f', r: 'j'}];
    const length = Math.random() > .5 ? 2 : 3;
    for (let i = 0; i < length; i++) {
        const l = ["d", "s", "a", "e", "r", "c", "x"][Math.floor(Math.random() * 7)];
        const r = ["k", "l", "m", "i", "o"][Math.floor(Math.random() * 5)];
        sequence.push({l, r});
    }

    return sequence;
}

const normalizeProps = (props: PlacementTestProps): PlacementTestProps => {
    return {
        sequence: props.sequence || generateSequence(),
        maxDelayMs: props.maxDelayMs || 3000
    }
}

export default function FingerPlacementTest(props: PlacementTestProps) {
    props = normalizeProps(props);
    const [currentTarget, setCurrentTarget] = createSignal<{l: string, r: string}>({l: "", r: ""});
    const onKeyDown = (e: KeyboardEvent) => {
        console.log(e.key);
    }
    const listenerId = createListener(document, "keydown", onKeyDown);
    const timeStart = Date.now();
    onCleanup(() => removeListener(listenerId));

    return (
        <div class={containerStyle} id="finger-placement-test">
            <h2>Finger Placement Test</h2>
            <OnScreenKeyboard highlighted={[currentTarget().l, currentTarget().r]} ignoreGrammarKeys 
                ignoreNumericKeys ignoreMathKeys ignoreSpecialKeys fingeringSchemeFocused={0} ignored={["Space"]}/>
            <div class={barContainerStyle} id="bar-container">
                <div class={timeBarStyleFunc(Date.now() - timeStart, props.maxDelayMs)} id="bar-bar">
                    <div class={barEndDotStyleFunc(Date.now() - timeStart, props.maxDelayMs)} id="bar-dot">
                    
                    </div>
                </div>
            </div>
        </div>
    )
}

const containerStyle = css`
    display: grid;
    justify-content: space-between;
    align-content: space-between;
    align-items: center;
    grid-template-columns: 1fr;
    grid-template-rows: .1fr .8fr .1fr;
    text-align: center;
    height: 30rem;
    width: 100%;
    background-color: #f0f0f0;
`

const barContainerStyle = css`
    display: grid;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-radius: .5rem;
    height: 100%;
`

const timeBarStyleFunc = (remainder: number, max: number) => css`
    width: 100%;
    height: 100%;
    background-color: black;
`
const barEndDotStyleFunc = (remainder: number, max: number) => css`
    position: absolute;
    height: 100%;
    width: 1rem;
    left: ${(remainder / max) * 100}%;
`