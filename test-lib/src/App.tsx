import type { Component } from 'solid-js';
import Comp from './Comp';
import OnScreenKeyboard from './fingerPlacementTest/OnScreenKeyboard';
import { css } from '@emotion/css';

const playerStyle = (x: number, y: number) => css`
  top: ${y}px;
  left: ${x}px;
  transition: all 0.3s linear;
`

const App: Component = () => {
  // Player is shooting {whom}
  // Asteroid spawned {where, velocity, size, charCombo}
  return (
    <div class="app">
      <h1>Hello world!!!!</h1>
      <Comp />
      <OnScreenKeyboard colorizationIntensity={1} fingeringSchemeFocused={0} hardShadeMultiFingerKeyGradients={false} />
    </div>
  );
};

export default App;
