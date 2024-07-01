import { RouterOutlet } from '@angular/router';
import { Renderer2, OnInit, Inject, Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <main class="main">
    <p>Root is below this guy</p>
    <div id="root"></div>
  </main>`,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {



    constructor(
        private _renderer2: Renderer2, 
        @Inject(DOCUMENT) private _document: Document
    ) { }

    public ngOnInit() {

        let script = this._renderer2.createElement('script');
        script.type = `text/javascript`;
        script.text = `
            {
                document.getElementById('root').innerHTML = 'Hello World';
            }
        `;

        this._renderer2.appendChild(this._document.body, script);
    }
}