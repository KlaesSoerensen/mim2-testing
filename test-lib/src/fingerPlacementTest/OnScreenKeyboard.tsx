import { JSX } from "solid-js/jsx-runtime";
import { createEffect } from "solid-js";
import { css } from '@emotion/css';
import handpath from '../assets/svg/handpath.svg';

interface OnScreenKeyboardProps {
    highlighted?: string[];
    ignored?: string[];
    showHands?: boolean;
    /**
     * Keys like CMD, ALT, SHIFT, etc. that are not printable characters.
     */
    ignoreSpecialKeys?: boolean;
    ignoreNumericKeys?: boolean;
    ignoreAlphabeticKeys?: boolean;
    ignoreGrammarKeys?: boolean;
    ignoreMathKeys?: boolean;
    layout?: KeyElement[][];
}

enum KeyType {
    Numeric = 'Numeric',
    Special = 'Special',
    Alphabetic = 'Alphabetic',
    Grammar = 'Grammar',
    Math = 'Math'
}

type KeyElement = {
    char: string;
    width: number;
    categories: KeyType[];
};

const kbFirstRow: KeyElement[] = [
    {char: '½', width: 1/16, categories: [KeyType.Numeric]},
    {char: '1', width: 1/16, categories: [KeyType.Numeric]}, 
    {char: '2', width: 1/16, categories: [KeyType.Numeric]},
    {char: '3', width: 1/16, categories: [KeyType.Numeric]},
    {char: '4', width: 1/16, categories: [KeyType.Numeric]},
    {char: '5', width: 1/16, categories: [KeyType.Numeric]},
    {char: '6', width: 1/16, categories: [KeyType.Numeric]},
    {char: '7', width: 1/16, categories: [KeyType.Numeric]},
    {char: '8', width: 1/16, categories: [KeyType.Numeric]},
    {char: '9', width: 1/16, categories: [KeyType.Numeric]},
    {char: '0', width: 1/16, categories: [KeyType.Numeric]},
    {char: '+', width: 1/16, categories: [KeyType.Math]},
    {char: '´', width: 1/16, categories: [KeyType.Grammar]},
    {char: '<-', width: 3/16, categories: [KeyType.Special]}
];
const kbSecondRow: KeyElement[] = [
    {char: 'Tab', width: 1.5/16, categories: [KeyType.Special]},
    {char: 'q', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'w', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'e', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'r', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 't', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'y', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'u', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'i', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'o', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'p', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'å', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: '¨', width: 1/16, categories: [KeyType.Grammar]},
    {char: 'Enter', width: 2.5/16, categories: [KeyType.Special]}
];
const kbThirdRow: KeyElement[] = [
    {char: 'Caps', width: 1.75/16, categories: [KeyType.Special]},
    {char: 'a', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 's', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'd', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'f', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'g', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'h', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'j', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'k', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'l', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'æ', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'ø', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: '\'', width: 1/16, categories: [KeyType.Grammar]},
    {char: 'Enter', width: 2.25/16, categories: [KeyType.Special]}
];
const kbFourthRow: KeyElement[] = [
    {char: 'Shift', width: 1.25/16, categories: [KeyType.Special]},
    {char: '>', width: 1/16, categories: [KeyType.Grammar]},
    {char: 'z', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'x', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'c', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'v', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'b', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'n', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: 'm', width: 1/16, categories: [KeyType.Alphabetic]},
    {char: ',', width: 1/16, categories: [KeyType.Grammar]},
    {char: '.', width: 1/16, categories: [KeyType.Grammar]},
    {char: '-', width: 1/16, categories: [KeyType.Grammar]},
    {char: 'Shift', width: 3.75/16, categories: [KeyType.Special]}
];
const kbFifthRow: KeyElement[] = [
    {char: 'Ctrl', width: 1.5/16, categories: [KeyType.Special]},
    {char: 'Win', width: 1.25/16, categories: [KeyType.Special]},
    {char: 'Alt', width: 1.25/16, categories: [KeyType.Special]},
    {char: 'Space', width: 8/16, categories: [KeyType.Alphabetic]},
    {char: 'Alt', width: 1.25/16, categories: [KeyType.Special]},
    {char: 'Win', width: 1.25/16, categories: [KeyType.Special]},
    {char: 'Ctrl', width: 1.5/16, categories: [KeyType.Special]}
];
const defaultLayoutDK = [
    kbFirstRow,
    kbSecondRow,
    kbThirdRow,
    kbFourthRow,
    kbFifthRow
];
const keySpacing = ".25rem";

export default function OnScreenKeyboard(props: OnScreenKeyboardProps) {
    const kbKeyHtmlElementMap = new Map<string, HTMLElement>();
    props.highlighted = props.highlighted || [];
    props.ignored = props.ignored || [];
    props.showHands = props.showHands || true;
    props.ignoreSpecialKeys = props.ignoreSpecialKeys || false;
    props.ignoreNumericKeys = props.ignoreNumericKeys || false;
    props.ignoreAlphabeticKeys = props.ignoreAlphabeticKeys || false;
    props.ignoreGrammarKeys = props.ignoreGrammarKeys || false;
    props.ignoreMathKeys = props.ignoreMathKeys || false;
    props.layout = props.layout || defaultLayoutDK;

    const appendDotIfForJ = (key: KeyElement): JSX.Element => {
        if (key.char === 'f' || key.char === 'j') {
            return <div class={fjBumpStyle}></div>;
        }
        return <></>;
    }

    const mapCharsToKeyElements = (keys: KeyElement[]): JSX.Element[] => {
        const elements: JSX.Element[] = [];
        keys.map((key, index) => {
            const isHighlighted = props.highlighted?.includes(key.char);
            const isIgnored = props.ignored?.includes(key.char)
                || (props.ignoreSpecialKeys && key.categories.includes(KeyType.Special))
                || (props.ignoreNumericKeys && key.categories.includes(KeyType.Numeric))
                || (props.ignoreAlphabeticKeys && key.categories.includes(KeyType.Alphabetic))
                || (props.ignoreGrammarKeys && key.categories.includes(KeyType.Grammar))
                || (props.ignoreMathKeys && key.categories.includes(KeyType.Math));

            let computedStyle = keyBaseStyle;
            if (isIgnored) {
                computedStyle = css`
                    ${keyBaseStyle}
                    background-image: linear-gradient(0deg, #333 0%, #555 20%);
                    color: #666;
                    &:hover {
                        color: #666;
                        filter: none;
                    }
                `;
            }
            if (isHighlighted) {
                computedStyle = css`
                    ${keyBaseStyle}
                    background-image: linear-gradient(0deg, #111 0%, #333 20%);
                    outline: 2px solid white;
                    color: white;
                    filter: drop-shadow(0 0 1rem white);
                `;
            }

            elements.push(
                <div class={computedStyle} id={"okb-" + key.char} ref={(el) => kbKeyHtmlElementMap.set(key.char, el)}>
                    <div>{key.char}</div>
                    {appendDotIfForJ(key)}
                </div>
            )
        });
        return elements;
    };

    const computeStylesForRow = (row: KeyElement[]): string => {
        const gridTemplateColumns = row.map((key) => `${key.width * 100}%`).join(' ');
        return css`
            height: 100%;
            display: grid;
            grid-template-columns: ${gridTemplateColumns};
        `;
    };

    const appendHands = () => {
        if(props.showHands) {
            return (
                <div class={handsOverlayContainerStyle}>
                    <svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
                        <path d={handpath} fill="black" stroke="black" stroke-width="1" />
                    </svg>
                    <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; transform: scaleX(-1)">
                        <path d={handpath} fill="black" stroke="black" stroke-width="1" />
                    </svg>
                </div>
            )
        }else{
            return <></>;
        }
    }

    // Render
    return (
        <div class={containerStyle}>
            {props.layout.map((row, index) => (
                <div class={computeStylesForRow(row)}>
                    {mapCharsToKeyElements(row)}
                </div>
            ))}
            {appendHands()}
        </div>
    )
}

const handsOverlayContainerStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const containerStyle = css`
    background-image: linear-gradient(70deg, #333, #666, #333, #666, #333);
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    row-gap: ${keySpacing};
    height: 13rem;
    padding: .25rem;
    padding-bottom: .5rem;
    border-radius: .5rem;
`;

const keyBaseStyle = css`
    border: 1.5px solid black;
    width: calc(100% - ${keySpacing});
    height: 100%;
    border-radius: .5rem;
    color: black;
    display: grid;
    align-items: center;
    background-image: linear-gradient(0deg, #555 0%, #999 20%);
    text-align: center;
    text-transform: uppercase;
    font-family: monospace;
    font-size: 1.25rem;
    &:hover {
        color: white;
        filter: drop-shadow(0 0 1rem white);
    }
`;

const fjBumpStyle = css`
    position: relative;
    width: 1rem;
    height: .25rem;
    border-radius: .5rem;
    background-image: linear-gradient(0deg, #555, #DDD);
    z-index: 10000;
    transform: translateX(-50%);
    left: 50%;
    padding: 0;
    margin: 0;
    `;