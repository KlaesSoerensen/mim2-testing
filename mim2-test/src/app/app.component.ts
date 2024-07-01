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
    private injectionComplete = false;

    constructor() { 
      afterNextRender(() => {
        if (!this.injectionComplete) {
          //@ts-ignore
          import("../../../test-lib/dist/assets/index.js")
          //^ this line imports the text contents of the code from the test-lib file
          //which happens to be javascript in a closure and auto-executes when evaluated
          //which will only happen on the client browser, after initial render
          //which happens to be having a component by the id of "solidjs-inlay-root" at the time this runs
          //how is this even possible? Why?
          this.injectionComplete = true;
        }
      });
    }
}
