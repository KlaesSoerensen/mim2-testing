import { JSX } from "solid-js/jsx-runtime";
import { css } from '@emotion/css';
import { KeyElement, SymbolType, DK_KEYBOARD_LAYOUT, FINGER_COLORS } from '../ts/KeyBoardLayouts';
import handpath from '../assets/svg/handpath.svg';

interface OnScreenKeyboardProps {
    /**
     * Keys that should be highlighted.
     * @default []
     */
    highlighted?: string[];
    /**
     * Keys that should be ignored. See the shorthand properties for ignoring specific types of keys.
     * @default []
     */
    ignored?: string[];
    /**
     * Show hand handplacement on the keyboard.
     * @default false
     */
    showHands?: boolean;
    /**
     * Show intended finger use for each key by coloring each key accordingly.
     * @default true
     */
    showIntendedFingerUseForKey?: boolean;
    /**
     * Relates to the "showIntendedFingerUseForKey" property
     * Hard shade the key with the gradient of the finger(s) available for the key.
     * (Constant / no interpolation of colors vs. linear gradient)
     * @default true
     */
    hardShadeMultiFingerKeyGradients?: boolean;
    /**
     * Relates to the "showIntendedFingerUseForKey" property
     * The intensity of the colorization. 0 is no colorization, 1 is full colorization.
     * @default 1
     */
    colorizationIntensity?: number;
    /**
     * Relates to the showIntendedFingerUseForKey property.
     * When set, the keyboard will highlight only the intended finger use for the given fingering scheme.
     * @default -1 (disabled)
     */
    fingeringSchemeFocused?: number;
    /**
     * Keys like CMD, ALT, SHIFT, etc. that are not printable characters.
     * @default false
     */
    ignoreSpecialKeys?: boolean;
    /**
     * Numeric keys 0-9 and ½.
     * @default false
     */
    ignoreNumericKeys?: boolean;
    /**
     * Alphabetic keys a-z and special language specific characters like: æ ø å.
     * @default false
     */
    ignoreAlphabeticKeys?: boolean;
    /**
     * Grammatical symbols like: , . ! ?.
     * @default false
     */
    ignoreGrammarKeys?: boolean;
    /**
     * Math keys like: + - * / =.
     * @default false
     */
    ignoreMathKeys?: boolean;
    /**
     * The layout of the keyboard. Each row is an array of KeyElement objects.
     * @default DK_KEYBOARD_LAYOUT
     */
    layout?: KeyElement[][];
}
const normalizeProps = (props: OnScreenKeyboardProps): OnScreenKeyboardProps => {
    props.highlighted = props.highlighted || [];

    props.ignored = props.ignored || [];
    props.ignoreSpecialKeys = props.ignoreSpecialKeys || false;
    props.ignoreNumericKeys = props.ignoreNumericKeys || false;
    props.ignoreAlphabeticKeys = props.ignoreAlphabeticKeys || false;
    props.ignoreGrammarKeys = props.ignoreGrammarKeys || false;
    props.ignoreMathKeys = props.ignoreMathKeys || false;

    props.showHands = props.showHands || false;
    props.showIntendedFingerUseForKey = props.showIntendedFingerUseForKey || true;
    props.fingeringSchemeFocused = props.fingeringSchemeFocused || -1;
    props.hardShadeMultiFingerKeyGradients = props.hardShadeMultiFingerKeyGradients || true;
    props.colorizationIntensity = props.colorizationIntensity || 1;

    props.layout = props.layout || DK_KEYBOARD_LAYOUT;

    return props;
}

const keySpacing = ".25rem";

export default function OnScreenKeyboard(props: OnScreenKeyboardProps) {
    props = normalizeProps(props);
    const kbKeyHtmlElementMap = new Map<string, HTMLElement>();

    const appendDotIfForJ = (key: KeyElement): JSX.Element => {
        if (key.char === 'f' || key.char === 'j') {
            return <div class={fjBumpStyle}></div>;
        }
        return <></>;
    }

    const colourizeTheButtonIfApplicable = (key: KeyElement, isIgnored: boolean, children: JSX.Element): JSX.Element => {
        if (!props.showIntendedFingerUseForKey || isIgnored) {
            return <>{children}</>;
        }
        //In the case that a specific scheme is requested OR no alternative fingerings are available
        if(props.fingeringSchemeFocused != -1 || key.finger.length == 1){
            let indexToUse = key.finger.length - 1;
            if(props.fingeringSchemeFocused != -1){
                indexToUse = props.fingeringSchemeFocused > key.finger.length - 1 ? key.finger.length - 1 : props.fingeringSchemeFocused;
            }
            const finger = key.finger[indexToUse];
            const constColor = `rgba(${FINGER_COLORS[finger]}, ${props.colorizationIntensity})`;
            //This little repition is needed as linear-gradient requires 2 or more colors inputted at all times.
            const computedGradient = `linear-gradient(90deg, ${constColor}, ${constColor});`;
         
            return <div class={colorOverlayStyle(computedGradient)}>{children}</div>;
        }

        //In the case that no specific scheme is requested
        let computedGradient = "linear-gradient(90deg, ";
        const stepSize = 100 / key.finger.length;
        for (let i = 0; i < key.finger.length; i++) {
            const finger = key.finger[i];
            const color = `rgba(${FINGER_COLORS[finger]}, ${props.colorizationIntensity})`;
            if(props.hardShadeMultiFingerKeyGradients){
                computedGradient += `${color} ${stepSize * i}%, ${color} ${(stepSize * (i + 1)) - 1}%`;
            }else{
                computedGradient += `${color}`;
            }
            if (i < key.finger.length - 1) {
                computedGradient += ", ";
            }
        }
        computedGradient += ");";
        return <div class={colorOverlayStyle(computedGradient)}>{children}</div>;
    }

    const mapCharsToKeyElements = (keys: KeyElement[]): JSX.Element[] => {
        const elements: JSX.Element[] = [];
        keys.map((key, index) => {
            const isHighlighted = props.highlighted?.includes(key.char);
            const isIgnored = props.ignored?.includes(key.char)
                || (props.ignoreSpecialKeys && key.symbolTypes.includes(SymbolType.Special))
                || (props.ignoreNumericKeys && key.symbolTypes.includes(SymbolType.Numeric))
                || (props.ignoreAlphabeticKeys && key.symbolTypes.includes(SymbolType.Alphabetic))
                || (props.ignoreGrammarKeys && key.symbolTypes.includes(SymbolType.Grammar))
                || (props.ignoreMathKeys && key.symbolTypes.includes(SymbolType.Math));

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

            const children = (
                <>
                <div class={keyboardTextStyle}>{key.char}</div>
                {appendDotIfForJ(key)}
                </>
            );

            elements.push(
                <div class={computedStyle} id={"okb-" + key.char} ref={(el) => kbKeyHtmlElementMap.set(key.char, el)}>
                    {colourizeTheButtonIfApplicable(key, isIgnored && !isHighlighted, children)}
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

const keyboardTextStyle = css`
    display: grid;
    align-items: center;
    justify-items: center;
    font-size: 1.25rem;
    text-transform: uppercase;
    font-family: monospace;
    text-shadow: 0 0 .1rem white;
    padding-bottom: .5rem;
`;

const colorOverlayStyle = (color: string) => css`
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: grid;
    align-items: center;
    background-image: ${color};
    border-radius: .5rem;
`;

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
    color: #000;
    display: grid;
    align-items: center;
    background-image: linear-gradient(0deg, #555 0%, #999 20%);
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
    background-image: linear-gradient(0deg, black, black);
    z-index: 100;
    transform: translate(-50%, -100%);
    left: 50%;
    `;