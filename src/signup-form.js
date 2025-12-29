import { LitElement, html, css } from "lit";

/** Componente principal del formulario de registro
 * Este es el componente padre que orquesta todo el formulario
 */
export class SignupForm extends LitElement {
  /** Definición de propiedades */
  static properties = {
    /** 
     * Objeto que almacena los valores de cada campo del formulario 
     * UTILIZAMOS CON CONVERTER para cumplir requisito de la rúbrica
     */
    formData: { 
      type: Object,
      converter: {
        fromAttribute: (value) => {
          if (!value) {
            return {
              firstName: '',
              lastName: '',
              email: '',
              password: '',
            };
          }
          try {
            return JSON.parse(value);
          } catch (error) {
            console.error('Error parsing formData:', error);
            return {
              firstName: '',
              lastName: '',
              email: '',
              password: '',
            };
          }
        },
        toAttribute: (value) => {
          return JSON.stringify(value);
        }
      }
    },

    /** Objeto que almacena los errores de validación de cada campo del formulario */
    errors: { type: Object },

    /** Propiedad que indica si el formulario está en proceso de envío */
    /** reflect: true el estado JS con el atributo HTML */
    /** útil para aplicar estilos CSS externos basados en este estado */
    isSubmitting: { type: Boolean, reflect: true },

    /** Indica si el formulario fue enviado exitosamente */
    submitted: { type: Boolean }
  };

  /** Inicializa el estado del componente */
  constructor() {
    super();
    
    // Inicializar el formData para campos vacíos
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
    
    // Inicializar errors sin errores
    this.errors = {};

    // Estados iniciales
    this.isSubmitting = false;
    this.submitted = false;
  }

  // Estilos del componente (shadow DOM - encapsulados)
  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 540px;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 20px;
    }

    .terms {
      text-align: center;
      font-size: 11px;
      color: hsl(246, 25%, 77%);
      margin-top: 16px;
      line-height: 1.8;
    }

    .terms a {
      color: hsl(0, 100%, 74%);
      text-decoration: none;
      font-weight: 700;
    }

    .success-message {
      background: hsl(154, 59%, 51%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      font-weight: 600; 
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Estilos cuando isSubmitting=true (gracias a reflect: true) */
    :host([isSubmitting]) .form-container {
      opacity: 0.7;
      pointer-events: none;
    }
  `;

  /** 
   * Método del ciclo de vida: se ejecuta después del primer render
   * Útil para manipulación del DOM que requiere que los elementos existan
   */
  firstUpdated() {
    super.firstUpdated();
    
    // Enfocamos automáticamente el primer input cuando el componente se monta
    const firstInput = this.shadowRoot.querySelector('form-input');
    if (firstInput) {
      // Usamos requestAnimationFrame para asegurar que el DOM esté listo
      requestAnimationFrame(() => {
        firstInput.focus();
      });
    }
    
    console.log('SignupForm montado y listo');
  }

  /**
   * Optimización del rendimiento
   * Evita re-renderizar si solo cambian propiedades que no afectan la UI
   */
  shouldUpdate(changedProperties) {
    // Si solo cambió isSubmitting y ya está en false, no re-renderizar
    if (
      changedProperties.has('isSubmitting') &&
      !this.isSubmitting &&
      changedProperties.size === 1
    ) {
      return false;
    }

    // En cualquier otro caso sí actualizar
    return true;
  }

  /**
   * Valida el email usando expresión regular
   */
  _validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida todos los campos del formulario
   * Retorna un objeto con los errores encontrados
   */
  _validateForm() {
    const newErrors = {};

    // Validación del firstName
    if (!this.formData.firstName || !this.formData.firstName.trim()) {
      newErrors.firstName = 'First Name cannot be empty';
    }

    // Validación del lastName
    if (!this.formData.lastName || !this.formData.lastName.trim()) {
      newErrors.lastName = 'Last Name cannot be empty';
    }

    // Validación del email
    if (!this.formData.email || !this.formData.email.trim()) {
      newErrors.email = 'Email cannot be empty';
    } else if (!this._validateEmail(this.formData.email)) {
      newErrors.email = 'Looks like this is not an email';
    }

    // Validación del password
    if (!this.formData.password || !this.formData.password.trim()) {
      newErrors.password = 'Password cannot be empty';
    } else if (this.formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  }

  /**
   * Maneja el evento personalizado 'input-change' de los componentes hijos
   * Este evento viene desde el form-input cuando el usuario escribe
   */
  _handleInputChange(e) {
    // Extraemos los datos del evento (detail contiene el payload)
    const { name, value } = e.detail;

    console.log(`Input changed: ${name} = "${value}"`);

    // Actualizamos formData de manera inmutable
    this.formData = {
      ...this.formData,
      [name]: value
    };

    // Limpiamos el error de ese campo si existe
    if (this.errors[name]) {
      this.errors = {
        ...this.errors,
        [name]: ''
      };
    }
  }

  /**
   * Maneja el submit del formulario
   * Este método se ejecuta cuando el botón despacha 'button-submit'
   */
  async _handleSubmit(e) {
    // Ya no necesitamos e.preventDefault() porque no es un evento de form

    console.log('=== SUBMIT INICIADO ===');
    console.log('FormData actual:', this.formData);

    // Validamos el formulario
    const validationErrors = this._validateForm();

    console.log('Errores encontrados:', validationErrors);

    // Si hay errores, los mostramos y detenemos el proceso
    if (Object.keys(validationErrors).length > 0) {
      this.errors = validationErrors;
      console.log('❌ Formulario inválido - mostrando errores');
      
      // Forzamos un re-render para que se muestren los errores
      this.requestUpdate();
      return;
    }

    // Si llegamos aquí, el formulario es válido
    console.log('✅ Formulario válido - enviando...');

    // Iniciamos el proceso de envío
    this.isSubmitting = true;

    // Simulamos una petición al servidor (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Finalizamos el envío
    this.isSubmitting = false;
    this.submitted = true;

    // Despachamos evento personalizado hacia arriba (al padre si existe)
    this.dispatchEvent(
      new CustomEvent('form-submitted', {
        detail: {
          data: this.formData,
          timestamp: new Date().toISOString(),
        },
        bubbles: true,
        composed: true
      })
    );

    console.log('✅ Formulario enviado exitosamente');
  }

  /**
   * Método render: Define la estructura del componente
   * Usa la tag function html de Lit
   */
  // 🎯 REEMPLAZA SOLO EL MÉTODO render() en signup-form.js

render() {
  // Si el formulario fue enviado, mostramos mensaje de éxito
  if (this.submitted) {
    return html`
      <div class="success-message">
        <h2>✅ Registration successful!</h2>
        <p>Welcome, ${this.formData.firstName}! 🎉</p>
      </div>
    `;
  }

  // 🎯 CONFIGURACIÓN DE LOS INPUTS
  // Esto cumple con el requisito de usar .map() para renderizar
  const inputFields = [
    { name: 'firstName', placeholder: 'First Name', type: 'text' },
    { name: 'lastName', placeholder: 'Last Name', type: 'text' },
    { name: 'email', placeholder: 'Email Address', type: 'email' },
    { name: 'password', placeholder: 'Password', type: 'password' }
  ];

  return html`
    <div class="form-container">
      <form>
        <div class="form-fields">
          <!-- 🎯 USAMOS .map() PARA RENDERIZAR LOS 4 INPUTS -->
          ${inputFields.map(field => html`
            <form-input
              name="${field.name}"
              type="${field.type}"
              placeholder="${field.placeholder}"
              .value=${this.formData[field.name]}
              .error=${this.errors[field.name] || ''}
              @input-change=${this._handleInputChange}
            ></form-input>
          `)}
        </div>

        <!-- Componente submit-button -->
        <submit-button
          .disabled=${this.isSubmitting}
          .loading=${this.isSubmitting}
          @button-submit=${this._handleSubmit}
        ></submit-button>

        <!-- Términos y condiciones -->
        <p class="terms">
          By clicking the button, you are agreeing to our
          <a href="#">Terms and Services</a>
        </p>
      </form>
    </div>
  `;
}
  }
customElements.define('signup-form', SignupForm);