import type { Component } from 'solid-js';
import Comp from './Comp';
import OnScreenKeyboard from './fingerPlacementTest/OnScreenKeyboard';
import SocketRawOutput from './socket/SocketRawOutput';
import FingerPlacementTest from './fingerPlacementTest/FingerPlacementTest';
import { injectGlobal } from '@emotion/css';

injectGlobal`
  body {
    margin: 0;
    padding: 1rem;
    font-family: sans-serif;
  }
`;

const App: Component = () => {
  // Player is shooting {whom}
  // Asteroid spawned {where, velocity, size, charCombo}
  return (
    <div class="app">
      <h1>Hello world!!!!</h1>
      <Comp />
      <FingerPlacementTest />
    </div>
  );
};

export default App;
