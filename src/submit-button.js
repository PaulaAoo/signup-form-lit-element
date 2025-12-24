import { LitElement, html, css } from "lit";

/** Componente de botón de envío reutilizable
 * Maneja estados de carga, deshabilitado y dispatch de eventos
 */
export class SubmitButton extends LitElement {
  // Definición de propiedades reactivas
  static properties = {
    // texto del botón
    text: { type: String },
    // Estado deshabilitado del botón
    disabled: { type: Boolean },
    // Estado de carga (muestra spinner)
    // reflect para sincronizar atributo HTML para estilos externos
    loading: { type: Boolean, reflect: true },
   
    /*// tipo de botón (submit, button, reset)
    buttontype: { type: String, attribute: "button-type" } 
    -> se comentaron porque se dejo fijo el tipo submit<--
    */ 
    
  };

  // Constructor: Inicializa valores por defecto
  constructor() {
    super();
    this.text = "Claim your free trial"; // texto por defecto
    this.disabled = false;
    this.loading = false;
    /*this.buttontype = 'submit'; // Por defecto es submit 
    //  -> se comentaron porque se dejo fijo el tipo submit<-- */
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

    /* Texto oculto cuando está cargando */
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
   * configura listeners o inicializaciones que requieren el DOM
   */
  firstUpdated() {
    super.firstUpdated();
    // Obtenemos referencia al botón
    const button = this.shadowRoot.querySelector("button");
    if (button) {
      // Agregamos listener para efecto ripple
      button.addEventListener("click", this._createRipple.bind(this));

      // Configuramos un ResizeObserver para detectar cambios de tamaño
      // Útil para responder a cambios de layout
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          console.log(
            `Button resized: ${entry.contentRect.width}x${entry.contentRect.height}`
          );
        }
      });

      resizeObserver.observe(button);
    }
    console.log("SubmitButton inicializado");
  }

  /**
   * Optimización: evita re-renderizar si los cambios no afectan la UI
   */
  shouldUpdate(changedProperties) {
    // si solo cambió 'disabled' pero loading es true, no re-renderizar
    // porque el botón ya está en estado de carga
    if (
      changedProperties.has("disabled") &&
      this.loading &&
      changedProperties.size === 1
    ) {
      return false;
    }

    // permitir actualización en otros casos
    return true;
  }

  /**
   * Crear efecto de onda (ripple) al hacer click
   */
  _createRipple(e) {
    // solo si no está deshabilitado
    if (this.disabled || this.loading) return;

    const button = e.currentTarget;
    const ripple = document.createElement("span");

    // Calculamos posición del click relativo al botón
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    // aplicamos estilos al ripple
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Se agrega el ripple al botón
    button.appendChild(ripple);

    // Eliminamos el ripple después de la animación
    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * Maneja el click del botón
   * Despacha evento personalizado al padre
   */
  _handleClick(e) {
    // si está deshabilitado o cargando, no hacer nada
    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }

    // despachamos evento personalizado 'form-submit'
    // bubbles: permite que el evento suba por el DOM
    // composed: crítico para atravesar shadow DOM
    this.dispatchEvent(
      new CustomEvent("form-submit", {
        detail: {
          timestamp: new Date().toISOString(),
          buttonText: this.text,
        },
        bubbles: true,
        composed: true,
      })
    );

    console.log("Submit button clicked");
  }

  /** Método público para simular un click desde afuera
   * útil para testing o control programático
   */
  click() {
    const button = this.shadowRoot.querySelector("button");
    if (button && !this.disabled && !this.loading) {
      button.click();
    }
  }

  /**
   * Render: define la estructura del componente
   * usa expresiones condicionales para mostrar spinner
   */
  render() {
    return html`
      <button
        type="submit" 
        ?disabled=${this.disabled || this.loading}
        @click=${this._handleClick}
        aria-busy=${this.loading ? "true" : "false"}
        aria-label=${this.loading ? "Loading..." : this.text}
      >
        <div class="button-content ${this.loading ? "loading" : ""}">
          <!-- Expresión condicional: muestra spinner si está cargando -->
          ${this.loading
            ? html` <span class="spinner" role="status"></span> `
            : ""}
          <!-- Texto del botón -->
          <span class="text">
            ${this.loading ? "Processing..." : this.text}
          </span>
        </div>
      </button>
    `;
  }
}

customElements.define("submit-button", SubmitButton);
