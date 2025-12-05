import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.3.1/all/lit-all.min.js';

/**
 * Or if you want a local copy of the library
 * import { LitElement, html, css } from '/lib/lit-all.min.js';
 */

let logoUrl = `${import.meta.url}/../assets/logo.png`;

export class MyLitCounter extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
      .container {
        display: flex; 
        flex-flow: row wrap; 
        justify-content: space-around; 
        align-items: center; 
        background-color: #c0c0ff; 
        padding: 0.25rem; 
        border-radius: 0.25rem;
      }
      #icon {
        width: 2rem; 
        height: 2rem; 
        border-radius: 0.25rem; 
        margin: 0.25rem; 
        display: flex; 
        flex-flow: row nowrap; 
        justify-content: center; 
        align-items: center; 
        background-color: #a0a0ee; 
        cursor: pointer; 
        border-width: 2px; 
        border-style: outset; 
        border-color: buttonface;
      }
      #icon img {
        width: 1.25rem;
      }
      #value {
        font-size: 1.5rem;
      }
    `;
  }

  static get properties() {
    return {
      counter: { type: Number },
    };
  }

  constructor() {
    super();
    this.counter = 0;
  }

  __increment() {
    this.counter += 1;
    this.dispatchEvent(new Event('increased', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="container">
        <div id="icon" @click=${this.__increment}>
          <img src=${logoUrl}>
        </div>
        <div id="value">
            ${this.counter}
        </div>
    </div>
    `;
  }
}

window.customElements.define('my-lit-counter', MyLitCounter);
