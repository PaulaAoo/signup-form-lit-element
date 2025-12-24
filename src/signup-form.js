import { LitElement, html, css } from "lit";

/** Componente principal del formulario de registro
 * Este es el componete padre que orquesta todo el formulario
 */
export class SignupForm extends LitElement {
  /** Definición de propiedades */
  static properties = {
    /** Objeto que almacena los valores de cada campo del formulario */
    formData: { type: Object },

    /** Objeto que almacena los errores de validación de cada campo del formulario */
    errors: { type: Object },

    /** Propiedad que indica si el formulario está en proceso de envío */
    /** reflect: true el estado JS con el atributo HTML */
    /** util para aplicar estilos CSS esternos basados en este estado */
    isSubmitting: { type: Boolean, reflect: true },

    /** Indica si el formulario fue enviado exitosamente */
    submitted: { type: Boolean },
  };
  /** Inicializa el estado del componente */

  constructor() {
    super(); // llama al contructor del LitElement
    //Inicializar el form data para campos vacios */
    this.FormData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
    //Inicializar errors sin errores */
    this.errors = {};

    //Estados iniciales
    this.isSubmitting = false;
    this.submitted = false;
  }

  //Estilos del componente (shadow DOM - encapsulados)
  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 540px;
    }

    .form-container {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 8px 0 rgba(0, 0, 0, 0.15);
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
    }
    //estilos cuando isSubmitting=true (gracias a reflect: true)//
    :host([isSubmitting]) .form-container {
      opacity: 0.7;
      pointer-events: none;
    }
  `;
  //Metodo del ciclo de vida: se ejecuta después del primer render
  //util para manipulación del DOM que requiere que los elementos existan
  firstUpdated() {
    super.firstUpdated();
    //Enfocamos automaticamente el primer input cuando el componente se monta
    const firstInput = this.shadowRoot.querySelector('form-input');
    if (firstInput) {
      //usamos requestanimationframe para asegurar que el DOM este listo
      requestAnimationFrame(() => {
        firstInput.focus();
      });
    }
    console.log('Signupform montado y listo');
  }

  //optimización del rendimiento
  // Evita re-renderizar si solo cambian propiedades que no afecta la UI
  shouldUpdate(changedProperties) {
    super.shouldUpdate(changedProperties);
    //si solo cambio isSubmitting y ya está en false no re-renderizar
    if (
      changedProperties.has('isSubmitting') &&
      !this.isSubmitting &&
      changedProperties.size === 1) {
      return false;
    }

    //En cualquier otro caso si actualizar
    return true;
  }
  //validar el email usando expresión regular
  _validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  //valida todos los campos del formulario
  //retorna un ejemplo con los errores encontrados
  _validateForm() {
    const newErrors = {};

    //validación del first name
    if (!this.FormData.firstName.trim()) {
      newErrors.firstName = 'First Name cannot be empty';
    }
    //validación del last name
    if (!this.FormData.lastName.trim()) {
      newErrors.lastName = 'Last Name cannot be empty';
    }
    //validación del email
    if (!this.FormData.email.trim()) {
      newErrors.email = 'email cannot be empty';
    } else if (!this._validateEmail(this.FormData.email)) {
      newErrors.email = 'Looks like this is not an email';
    }
    //validación del password
    if (!this.FormData.password.trim()) {
      newErrors.password = 'password cannot be empty';
    } else if (!this.FormData.password.length < 6) {
      newErrors.password = 'password must be least 6 characters';
    }
    return newErrors;
  }
  //maneja el evento personalizado 'input-change' de los componentes hijos
  //Este evento viene desde el form-input cuendo el usuario escribe
  _handleInputChange(e) {
    //Extremos los datos del evento (detail contiene el payload)
    const { name, value } = e.detail;

    //Actualizamos formData de manera inmutable
    this.FormData = {
      ...this.FormData,
      [name]: value
    };

    //Limpiamos el error de ese campo si existe
    if (this.errors[name]) {
      this.errors = {
        ...this.errors,
        [name]: '',
      };
    }
  }

  //Maneja el evento 'form-submit' del boton de envío
  async _handleSubmit(e) {
    e.preventDefault(); //prevenimos el comportamiento por defecto

    //validamos el formulario
    const validationErrors = this._validateForm();

    //si hay errores, los mostramos y detenemos el proceso
    if (Object.keys(validationErrors).length > 0) {
      this.errors = validationErrors;
      return;
    }
    //Iniciamos el proceso de envío
    this.isSubmitting = true;

    //Simulamos una petición al servidor (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));

    //se finaliza el envío
    this.isSubmitting = false;
    this.submitted = true;

    //despechamos evento personalizado hacia arriba (al padre si existe)
    //bubbles: permite que el evento suba por el Dom tradicional
    //composed: permite atravesar el shadow dom
    this.dispatchEvent(
      new CustomEvent('form-submitted', {
        detail: {
          data: this.formData,
          timestamp: new Date().toISOString(),
        },

        bubbles: true,
        composed: true,
      })
    );

    console.log('Formulario enviado:', this.formData);
  }

  //Metodo render: Define la estructura del componente
  //Usa la tag function html de lit

  render() {
    // si el formulario fue enviado, mostramos mensaje de exito
    if (this.submitted) {
      return html`
        <div class="success-message">
          <h2>Registration successful</h2>
          <p>Welcome, ${this.formData.firstName}</p>
        </div>
      `;
    }

    return html`
      <div class="form-container">
        <form @submit=${this._handleSubmit}>
          <div class="form-fields">
            <!--componente form-input para first name -->
            <form-input
              name="firstName"
              placeholder="First Name"
              .value=${this.formData?.firstName}
              .error=${this.errors.firstName || ''}
              @input-change=${this._handleInputChange}
            ></form-input>

            <!-- componente form-input para last name -->
            <form-input
              name="lastName"
              placeholder="Last Name"
              .value=${this.formData?.lastName}
              .error=${this.errors.lastName || ''}
              @input-change=${this._handleInputChange}
            ></form-input>

            <!-- componente form-input para email -->
            <form-input
              name="email"
              type="email"
              placeholder="Email Address"
              .value=${this.formData?.email}
              .error=${this.errors.email || ''}
              @input-change=${this._handleInputChange}
            ></form-input>

             <!-- componente form-input para password -->
            <form-input
              name="password"
              type="password"
              placeholder="Password"
              .value=${this.formData?.password}
              .error=${this.errors.password || ''}
              @input-change=${this._handleInputChange}
            ></form-input>
          </div>

           <!-- Componente submit-button -->
          <submit-button
            .disabled=${this.isSubmitting}
            .loading=${this.isSubmitting}
          ></submit-button>

           <!-- Terminos y condiciones -->
          <p class="terms">
            By clicking the button. you are agreeing to our
            <a href="#">Terms and services</a>
          </p>
        </form>
      </div>
    `;
  }
}

customElements.define('signup-form', SignupForm);
