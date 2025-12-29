import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export class FormInput extends LitElement {

    static properties = {
        name: { type: String },
        type: { type: String, reflect: true },
        value: { type: String },
        placeholder: { type: String },
        error: { type: String },
        touched: { type: Boolean }
    };

    constructor() {
        super();
        this.name = '';
        this.type = 'text';
        this.value = '';
        this.placeholder = '';
        this.error = '';
        this.touched = false;
    }

    static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .input-wrapper {
      position: relative;
      width: 100%;
    }

    input {
      width: 100%;
      padding: 15px 20px;
      border: 2px solid hsl(246, 25%, 77%);
      border-radius: 5px;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: hsl(249, 10%, 26%);
      outline: none;
      transition: all 0.3s ease;
      background-color: white;
      box-sizing: border-box;
    }

    /* Placeholder normal */
    input::placeholder {
      color: hsl(249, 10%, 26%);
      opacity: 0.5;
      font-weight: 600;
    }

    /* Estado focus (cuando el usuario hace click) */
    input:focus {
      border-color: hsl(248, 32%, 49%);
    }

    /* Estado de error */
    input.error {
      border: 2px solid hsl(0, 100%, 74%);
      color: hsl(0, 100%, 74%);
      padding-right: 50px; /* Espacio para el ícono */
    }

    /* Placeholder en estado de error (color rojo) */
    input.error::placeholder {
      color: hsl(0, 100%, 74%);
      opacity: 1;
    }

    /* IMPORTANTE: Cuando hay error Y hay texto, el texto es rojo */
    input.error:not(:placeholder-shown) {
      color: hsl(0, 100%, 74%);
    }

    /* Ícono de error - USANDO RUTA DE /assets */
    .error-icon {
      position: absolute;
      right: 20px;
      top: 25px;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      display: none;
      pointer-events: none;
    }

    .error-icon.show {
      display: block;
      animation: shake 0.5s ease-in-out;
    }

    /* Mensaje de error */
    .error-message {
      text-align: right;
      font-size: 11px;
      font-style: italic;
      color: hsl(0, 100%, 74%);
      margin-top: 6px;
      display: none;
    }

    .error-message.show {
      display: block;
      animation: slideDown 0.3s ease-out;
    }

    /* Animación del ícono (shake - temblor) */
    @keyframes shake {
      0%, 100% { transform: translateY(-50%) translateX(0); }
      25% { transform: translateY(-50%) translateX(-5px); }
      75% { transform: translateY(-50%) translateX(5px); }
    }

    /* Animación del mensaje de error (slideDown) */
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

    /**
     * CICLO DE VIDA: Optimización de renderizado
     * Solo re-renderiza cuando cambian propiedades que afectan la UI
     */
    shouldUpdate(changedProperties) {
        // Log para debugging (puedes quitarlo después)
        console.log('form-input shouldUpdate:', Array.from(changedProperties.keys()));
        
        // Solo actualizar si cambian estas propiedades visuales
        return (
            changedProperties.has('value') ||
            changedProperties.has('error') ||
            changedProperties.has('placeholder') ||
            changedProperties.has('type') ||
            changedProperties.has('touched')
        );
    }

    /**
     *  CICLO DE VIDA: Después del primer render
     * Útil para logging o setup adicional
     */
    firstUpdated() {
        console.log(`form-input "${this.name}" montado correctamente`);
    }

    /**
     * Maneja el evento input del campo
     * Despacha evento personalizado hacia el padre
     */
    _handleInput(e) {
        const newValue = e.target.value;

        this.dispatchEvent(
            new CustomEvent('input-change', {
                detail: {
                    name: this.name,
                    value: newValue
                },
                bubbles: true,
                composed: true
            })
        );
    }

    /**
     * Método público para enfocar el input desde afuera
     * Ejemplo: firstInput.focus()
     */
    focus() {
        const input = this.shadowRoot.querySelector('input');
        if (input) {
            input.focus();
        }
    }

    render() {
        const hasError = !!this.error;

        return html`
      <div class="input-wrapper">
        <input
          type="${ifDefined(this.type)}"
          name="${this.name}"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          class="${hasError ? 'error' : ''}"
          @input="${this._handleInput}"
        />
        
        <!-- 
          🎯 ÍCONO DE ERROR 
          Usando ruta relativa desde /src/assets/
          Vite automáticamente resuelve esta ruta
        -->
        <img 
          class="error-icon ${hasError ? 'show' : ''}"
          src="/src/assets/icon-error.svg"
          alt="Error icon"
          aria-hidden="true"
        />

        <!-- Mensaje de error -->
        <p class="error-message ${hasError ? 'show' : ''}"
           role="alert"
           aria-live="polite">
          ${this.error}
        </p>
      </div>
    `;
    }
}

customElements.define('form-input', FormInput);