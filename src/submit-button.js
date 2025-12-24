
import { LitElement, html, css } from "lit";

/** Componente de boton de envío reutilizab
 * Maneja estados de carg, deshabilitando y dispatch de eventos
 */
export class SubmitButton extends LitElement {
  // Definición de propiedades reactivas
  static properties = {
    // texto del botón
    text: { type: String },
    // Estado deshabilitado del boton
    disabled: { type: Boolean },
    // Estado de carga (muestra spinner)
    // reflect para sincronizar atributo HTML para estilos externos
    loading: { type: Boolean, reflect: true },

    //tipo de boton (submit, button, reset)
    buttonType: { type: String, attribute: 'button-type' }
  };
  //Constructor: Inicializa valores por defecto
    constructor() {
        super();
        this.text = 'Clain your free trial'; //texto por defecto
        this.disabled = false;
        this.loading = false;
        this.buttonType = 'submit';  // Por defecto es submit
    }

    //Estilos encapsulados del componente
    static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    button{
        width: 100%;
        padding: 15px;
        background: hsl(154, 59%, 51%); 
        color: white; 
        border: none; 
        border-radius: 5px;
        font-size: 15px;
        font-weight: 600;
        font-family: 'Poppins', sans-serif; 
        text-transform: uppercase; 
        letter-spacing: 1px;
        cursor: pointer; 
        box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1); 
        transition: all 0.3s ease; 
        position: relative; overflow: hidden;
    }

    /* Hover en el boton*/
    button:hover:not(:disabled){
        background: hsl(154, 59%, 45%);  
        transform: translate(-2px);
        box-shadow: 0 6px 0 rgba(0, 0, 0, 0.15);
    }
    /* Active (Cuando se prsiona) */
    button:active:not(:disabled){
        transform: translateY(1px);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
    }

    /* Estado deshabilitado */
    button:disabled{
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    /* Contenedor del texto del boton */
    .button-content{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    /* Spinner de carga */
    .spinner{
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8 linear infinite;   
    }

    /* Animación del spinner */
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Texto oculto cuando está cargando */
    .button-content.loading .text{
        opacity: 0.7;
    }

    /* Efecto de onda al hacer click */
    .ripple{
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
    //Obtenemos referencia al botón
    const button = this.shadowRoot.querySelector('button');
    if (button) {
      //Agregamos listener para efecto ripple
      button.addEventListener('click', this._createRipple.bind(this));

      //Configuramos un ResizeObserver para detectar cambios de tamaño
      //Útil para responder a cambios de layout
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            console.log('Button resized: ${entry.contentRect.width}x${entry.contentRect.height}');
        }

    });
   
        resizeObserver.observe(button);
}   
        console.log('SubmitButton inicializando');
    } 
    
    /**
     * Optimización: evita re-renderizar si los cambios no afectan la UI
     */
    shouldUpdate(changedProperties) {
    // si solo cambio 'disabled' pero loanding es true, no re-renderizar
    // porque el boton ya esta en estado de carga
    if (
      changedProperties.has('disabled') &&
      this.loading &&
      changedProperties.size === 1) {
      return false;

    }

    //permitir actualización en otros casos
    return true;
}
    /**
     * Crear efecto de onda (ripple) al hacer click
        */
    _createRipple(e){
        //solo si no esta deshabilitado
        if (this.disabled || this.loading) return;

        const button = e.currentTarget;
        const ripple = document.createElement('span');

        //Calculamos posición del click relativo al botón
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        //aplicamos estilos al ripple
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        //Se agrega el ripple al botón
        button.appendChild(ripple);

        //Eliminamos el ripple después de la animación
        setTimeout(()=> ripple.remove(), 600);
    }  
        /**
         * Maneja el cick del boton
         * Despacha evento personalizado al padre
         */
        _handleClick(e) {
         //si esta deshabilitado o cargando, no hacer nada
         if(this.disabled || this.loading){
            e.preventDefault();
            return;
         }  
        //despechamos evento personalizado 'form- submit'
        //bubbles: permite que el evento suba por el Dom
        //composed: contiene información adicional del evento
        this.dispatchEvent(new CustomEvent('form-submit', {
            detail: {
                timestamp: new Date().toISOString(),
                buttonText: this.text,
            },
            bubbles: true,
            composed: true, //critico para atravesar shadow DOM
        }));

            console.log('Submit button clicked');
    }
            
    
}    


