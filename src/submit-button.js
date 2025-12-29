import { LitElement, html, css } from "lit";

/** 
 * Componente de botón de envío reutilizable
 * Maneja estados de carga, deshabilitado
 * 
 *  Este botón despacha un evento que el form padre puede escuchar
 */
export class SubmitButton extends LitElement {
  // Definición de propiedades reactivas
  static properties = {
    // Texto del botón
    text: { type: String },
    // Estado deshabilitado del botón
    disabled: { type: Boolean, reflect: true },
    // Estado de carga (muestra spinner)
    loading: { type: Boolean, reflect: true }
  };

  // Constructor: Inicializa valores por defecto
  constructor() {
    super();
    this.text = "Claim your free trial";
    this.disabled = false;
    this.loading = false;
  }

  // Estilos encapsulados del componente
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    button {
      width: 100%;
      padding: 15px;
      background: hsl(154, 59%, 51%);
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 15px;
      font-weight: 600;
      font-family: "Poppins", sans-serif;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    /* Hover en el botón */
    button:hover:not(:disabled) {
      background: hsl(154, 59%, 45%);
      transform: translateY(-2px);
      box-shadow: 0 6px 0 rgba(0, 0, 0, 0.15);
    }

    /* Active (Cuando se presiona) */
    button:active:not(:disabled) {
      transform: translateY(1px);
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
    }

    /* Estado deshabilitado */
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* Contenedor del texto del botón */
    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    /* Spinner de carga */
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    /* Animación del spinner */
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Texto con opacidad cuando está cargando */
    .button-content.loading .text {
      opacity: 0.7;
    }

    /* Efecto de onda al hacer click */
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }

    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    /* Estilos cuando el host tiene el atributo loading */
    :host([loading]) button {
      pointer-events: none;
    }
  `;

  /**
   * Ciclo de vida: se ejecuta después del primer render
   */
  firstUpdated() {
    super.firstUpdated();
    const button = this.shadowRoot.querySelector("button");
    
    if (button) {
      // Agregamos listener para efecto ripple visual
      button.addEventListener("click", this._createRipple.bind(this));
    }
    
    console.log("SubmitButton inicializado");
  }

  /**
   * Optimización: evita re-renderizar si los cambios no afectan la UI
   */
  shouldUpdate(changedProperties) {
    // Si solo cambió 'disabled' pero loading es true, no re-renderizar
    if (
      changedProperties.has("disabled") &&
      this.loading &&
      changedProperties.size === 1
    ) {
      return false;
    }

    return true;
  }

  /**
   * Crear efecto de onda (ripple) al hacer click
   * Es solo visual, no afecta la funcionalidad
   */
  _createRipple(e) {
    if (this.disabled || this.loading) return;

    const button = e.currentTarget;
    const ripple = document.createElement("span");

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * MANEJA EL CLICK DEL BOTÓN
   * Despacha un evento personalizado que el form padre puede escuchar
   */
  _handleClick(e) {
    console.log(' Submit button clicked');
    
    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }

    // Despachamos evento personalizado 'button-submit'
    // bubbles: true - sube por el DOM
    // composed: true - atraviesa Shadow DOM (CRÍTICO)
    this.dispatchEvent(
      new CustomEvent('button-submit', {
        bubbles: true,
        composed: true,
        detail: {
          timestamp: new Date().toISOString()
        }
      })
    );
  }

  /**
   * Render: define la estructura del componente
   */
  render() {
    return html`
      <button
        type="button"
        ?disabled=${this.disabled || this.loading}
        @click=${this._handleClick}
        aria-busy=${this.loading ? "true" : "false"}
        aria-label=${this.loading ? "Loading..." : this.text}
      >
        <div class="button-content ${this.loading ? "loading" : ""}">
          ${this.loading
            ? html`<span class="spinner" role="status"></span>`
            : ""}
          <span class="text">
            ${this.loading ? "Processing..." : this.text}
          </span>
        </div>
      </button>
    `;
  }
}

customElements.define("submit-button", SubmitButton);