import { RouterOutlet } from '@angular/router';
import { Renderer2, OnInit, Inject, Component, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <main class="main" #compRootElement>
    <p>Root is below this guy</p>
    <div id="solidjs-inlay-root">PLACEHOLDER</div>
  </main>`,
  styleUrl: './app.component.css'
})
export class AppComponent {

    @ViewChild('compRootElement', { static: true }) compRootElement!: ElementRef<HTMLDivElement>;
    private injectionComplete = false;

    constructor(
        private _renderer2: Renderer2, 
        @Inject(DOCUMENT) private _document: Document
    ) { 
      afterNextRender(() => {
        if (!this.injectionComplete) {
          //@ts-ignore
          import("../../../test-lib/dist/assets/index.js")
          //^ this line imports the code from the test-lib
          //which also auto-executes when evaluated
          //which will only happen on the client browser
          //which happens to be having a component by the id of "solidjs-inlay-root" at the time this runs
          //how is this even possible? Why?
          this.injectionComplete = true;
        }
      });
    }
}
