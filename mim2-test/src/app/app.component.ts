import { RouterOutlet } from '@angular/router';
import { Renderer2, OnInit, Inject, Component, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <main class="main" #compRootElement>
    <div id="solidjs-inlay-root"></div>
  </main>`,
  styles: `
    .keyboard-container{background-color:red}
    .app{background-color:gray}

  `
})
export class AppComponent {
    constructor() {
      //@ts-ignore
      afterNextRender(() => {import("../../../test-lib/dist/assets/index.js")});
    }
}
