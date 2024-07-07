import { JSX } from "solid-js/jsx-runtime";
import { css } from "@emotion/css";
import { connect } from "./PubSub";
import { createSignal } from "solid-js";

interface SocketOutputProps {

}

export default function SocketRawOutput(props: SocketOutputProps): JSX.Element {
    const [message, setMessage] = createSignal<string>("No message yet...")
    const [error, setError] = createSignal<string>("No error yet...")
    const [isClosed, setIsClosed] = createSignal<boolean>(false)
    const [currentConnection, setCurrentConnection] = createSignal<string>("No connection yet...")

    connect(msg => {
        setMessage(msg.data)
        setCurrentConnection(msg.currentTarget.url)
        
    })

    const getBody = (): JSX.Element => {
        if (isClosed()) {
            return <div>Socket is closed</div>
        }
        return <div>
            <div>Current connection: {currentConnection()}</div>
            <div>Message: {message()}</div>
            <div>Error: {error()}</div>
        </div>
    }


  return (
    <div class={socketContainerStyle}>
      <h1>Socket says:</h1>
        <div class={socketOutputStyle}>
            {getBody()}
        </div>
    </div>
  );
};

const socketOutputStyle = css`
    width: 100%;
    height: 100%;
    background-color: #000;
    color: #fff;
    display: flex;
    border-radius: .5rem;
    border: 1px solid black;
`
const socketContainerStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    height: 30rem;
`