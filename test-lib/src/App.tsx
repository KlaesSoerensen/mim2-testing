import type { Component } from 'solid-js';
import Comp from './Comp';
import OnScreenKeyboard from './fingerPlacementTest/OnScreenKeyboard';
import SocketRawOutput from './socket/SocketRawOutput';
import FingerPlacementTest from './fingerPlacementTest/FingerPlacementTest';
import { injectGlobal } from '@emotion/css';
import InputBufferDisplay from './inputTester/InputBufferDisplay';
import { InputBuffer } from './ts/inputBuffer';

injectGlobal`
  body {
    margin: 0;
    padding: 1rem;
    font-family: sans-serif;
  }
`;

const App: Component = () => {
  let self;


  return (
    <div class="app" ref={self}>
      <h1>Hello world!!!!</h1>
      <Comp />
      <FingerPlacementTest 
        whenCompleteDo={() => {console.log("Sequence complete")}} 
        onFailDo={() => {console.log("Sequence failed")}} 
        topLevelCapturer={document}
      />
        
        
    </div>
  );
};

export default App;
