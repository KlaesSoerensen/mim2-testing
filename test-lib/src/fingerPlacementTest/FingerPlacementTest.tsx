import OnScreenKeyboard from "./OnScreenKeyboard";
import { createSignal, onCleanup, createEffect } from "solid-js";
import { createListener, removeListener } from "../ts/events";
import { css } from '@emotion/css';

interface PlacementTestProps {
    whenCompleteDo: () => void,
    onFailDo?: () => void,
    /**
     * The sequence of keys to be pressed.
     * @default [{l: 'f', r: 'j'}, {l: "d", r: "k"}, {l: "s", r: "l"}]
     */
    sequence?: {l: string, r: string}[],
    /**
     * Max delay between inputs for each element in the sequence.
     * @default 150
     */
    maxInputDelayMs?: number,
    /**
     * Max delay between elements in the sequence.
     * @default 1000
     */
    maxSequenceDelayMs?: number,
    /**
     * The element to capture key events from.
     * @default document
     */
    topLevelCapturer?: HTMLElement | Document,
    /**
     * The amount of times per second the display is updated.
     * This is also the "fps" of checking current inputs against the sequence. 
     * With lower maxInputDelayMs values, this should be higher.
     * @default 50
     */
    updateResolution?: number
}

const generateSequence = (): {l: string, r: string}[] => {
    const sequence = [{l: 'f', r: 'j'}];
    const length = Math.random() > .5 ? 2 : 3;
    for (let i = 0; i < length; i++) {
        const l = ["d", "s", "a", "e", "r", "c", "x"][Math.floor(Math.random() * 7)];
        const r = ["k", "l", "m", "i", "o"][Math.floor(Math.random() * 5)];
        sequence.push({l, r});
    }
    console.log(sequence)
    return sequence;
}

const normalizeProps = (props: PlacementTestProps): PlacementTestProps => {
    return {
        onFailDo: props.onFailDo ?? (() => {}), //NOOP
        whenCompleteDo: props.whenCompleteDo,
        sequence: props.sequence ?? generateSequence(),
        maxInputDelayMs: props.maxInputDelayMs ?? 150,
        maxSequenceDelayMs: props.maxSequenceDelayMs ?? 1000,
        // topLevelCapturer is handled specially as it defaults to this' resulting DOM element
        updateResolution: props.updateResolution ?? 50
    }
}
function removeFirst<T>(arr: T[], predicate: (value: T) => boolean): T[] {
    const index = arr.findIndex(predicate);
    if (index !== -1) {
        arr.splice(index, 1);
    }
    return arr;
}
export default function FingerPlacementTest(props: PlacementTestProps) {
    props = normalizeProps(props);
    const [sequenceIndex, setSequenceIndex] = createSignal<number>(0);
    const [currentTarget, setCurrentTarget] = createSignal<[string, string]>([props.sequence[sequenceIndex()].l, props.sequence[sequenceIndex()].r]);
    const [inputBuffer, setInputBuffer] = createSignal<string[]>([]);
    const [listenerId, setListenerId] = createSignal<number>(0);
    const [currentCountdownNumber, setCurrentCountdownNumber] = createSignal<number>(3);
    const [timeLeftOfCurrentElement, setTimeLeftOfCurrentElement] = createSignal<number>(currentCountdownNumber() * 1000 + props.maxSequenceDelayMs);
    const [updateInterval, setUpdateInterval] = createSignal<NodeJS.Timeout | null>(null);
    let self: HTMLDivElement; //This element as shown in the DOM, initialized in the return statement

    const checkCompletion = (buffer: string[]) => {
        //If buffer contains the targets, move to next target
        let foundLTarget = false;
        let foundRTarget = false;
        const target = currentTarget();
        for (const char of buffer) {
            if (char === target[0]) foundLTarget = true;
            if (char === target[1]) foundRTarget = true;
        }

        if (foundLTarget && foundRTarget) {
            setSequenceIndex(sequenceIndex() + 1);
            const nextTarget = props.sequence[sequenceIndex()];
            if (sequenceIndex() === props.sequence.length - 1 || !nextTarget) {
                props.whenCompleteDo();
                removeListener(listenerId());
                clearInterval(updateInterval());
                return;
            }
            setCurrentTarget([nextTarget.l, nextTarget.r]);
            setInputBuffer([]);
            setTimeLeftOfCurrentElement(props.maxSequenceDelayMs);
        }
    }

    const onKeyDown = (e: KeyboardEvent) => {
        const currentBuffer = inputBuffer();
        const keyInput = e.key.toLowerCase();
        //Add input to buffer
        setInputBuffer([...currentBuffer, keyInput]);
        console.log(currentBuffer);
        //However, remove it again after maxDelayMs
        setTimeout(() => {
            //Remove the key from the buffer
            //Remove only the first as the user may be pressing it multiple times - which is allowed
            setInputBuffer(removeFirst(currentBuffer, char => char != keyInput));
        }, props.maxInputDelayMs);
        console.log(currentTarget());
        checkCompletion(currentBuffer);
    }
    onCleanup(() => {
        removeListener(listenerId());
        clearInterval(updateInterval());
    });

    const andSoItBegins = () => {
        const computedCapturer = props.topLevelCapturer ?? self;
        setListenerId(createListener(computedCapturer, "keydown", onKeyDown));
        setCurrentCountdownNumber(currentCountdownNumber() - 1)
        setSequenceIndex(0);
        const nextTarget = props.sequence[sequenceIndex()];
        setCurrentTarget([nextTarget.l, nextTarget.r]);
        setTimeLeftOfCurrentElement(props.maxSequenceDelayMs);
        const computedUpdateResolution = 1000 / props.updateResolution;
        setUpdateInterval(setInterval(() => {
            setTimeLeftOfCurrentElement(Math.max(0, timeLeftOfCurrentElement() - computedUpdateResolution));
            checkCompletion(inputBuffer());
        }, computedUpdateResolution));
    }

    setTimeout(() => {setCurrentCountdownNumber(currentCountdownNumber() - 1)}, 1000);
    setTimeout(() => {setCurrentCountdownNumber(currentCountdownNumber() - 1)}, 2000);
    setTimeout(andSoItBegins, 3000);

    const appendInitialCountdown = () => {
        if (currentCountdownNumber() <= 0) {
            return <></>
        }
        return <div class={countdownStyle}>{currentCountdownNumber()}</div>
    }

    return (
        <div class={containerStyle} id="finger-placement-test" ref={self}>
            <h2>Finger Placement Test</h2>
            <OnScreenKeyboard highlighted={currentTarget()} ignoreGrammarKeys ignoreNumericKeys ignoreMathKeys
                  ignoreSpecialKeys fingeringSchemeFocused={0} ignored={[...inputBuffer(), "Space"]}/>
            <div class={barContainerStyle} id="bar-container">
                <div class={timeBarStyleFunc(timeLeftOfCurrentElement(), props.maxSequenceDelayMs)} id="bar-bar"></div>
            </div>
            {appendInitialCountdown()}
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

const countdownStyle = css`
    position: absolute;
    display: grid;
    align-items: center;
    background-image: radial-gradient(circle, #ffffffff 0%, #00000000 50%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 5rem;
    font-weight: bold;
    margin: 0;
    padding: 0;
    z-index: 100;
    width: 33%;
    height: 33%;
    text-align: center;
`

const barContainerStyle = css`
    position: relative;
    display: grid;
    justify-items: center;
    justify-content: center;
    max-width: 100%;
    border-radius: .5rem;
    height: 100%;
`

const timeBarStyleFunc = (remainder: number, max: number) => css`
    display: flex;
    width: ${remainder / max}%;
    height: 100%;
    background-color: black;
`