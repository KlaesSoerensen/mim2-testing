import { InputBuffer } from "../ts/inputBuffer";

interface InputBufferDisplayProps {
    buffer: InputBuffer;
}

export default function InputBufferDisplay(props: InputBufferDisplayProps) {
    return (
        <div>
            <p>Current input: {props.buffer.current}</p>
        </div>
    );
}