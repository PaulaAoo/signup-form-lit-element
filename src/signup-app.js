import { LitElement, html, css } from 'lit';   

class SignupApp extends LitElement {
    
    static styles = css`
        .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f0f0f0;
    }

    h1 {
      color: #333;
      text-align: center;
    }
    `;

    render() {
        return html`
        <div class="container">
         <h1>hola, soy signup-app</h1>
        </div>
        `;
    }
}
customElements.define('signup-app', SignupApp); 