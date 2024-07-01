import type { Component } from 'solid-js';
import Comp from './Comp';
import OnScreenKeyboard from './fingerPlacementTest/OnScreenKeyboard';

const App: Component = () => {
  return (
    <div class="app">
      <h1>Hello world!!!!</h1>
      <Comp />
      <OnScreenKeyboard />
    </div>
  );
};

export default App;
