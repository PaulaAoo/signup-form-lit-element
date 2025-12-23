import { LitElement, html, css } from "lit";    

/** Componente principal del formulario de registro
 * Este es el componete padre que orquesta todo el formulario
 */
export class SignupForm extends LitElement{
/** Definición de propiedades */
static properties = {
/** Objeto que almacena los valores de cada campo del formulario */
 FormData: { type:Object},

 /** Objeto que almacena los errores de validación de cada campo del formulario */
 errors:{type:Object},

 /** Propiedad que indica si el formulario está en proceso de envío */
/** reflect: true el estado JS con el atributo HTML */
/** util para aplicar estilos CSS esternos basados en este estado */
isSubmitting:{type: Boolean, Reflect:true},

/** Indica si el formulario fue enviado exitosamente */
submitted:{type:Boolean}

};
/** Inicializa el estado del componente */

constructor(){
    super(); // llama al contructor del LitElement
//Inicializar el form data para campos vacios */
this.FormData ={
    firstName:'',
    lastName:'',
    email:'',
    password:''
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

.form-container{
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 8px 0 rgba(0. 0. 0.15);
}

.form-fields{
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
}
.terms{
    text-align: center;
    front-size: 11px;
    color hsl(246, 25%, 77%);
    margin-top: 16px;
    line-height:1.8;
}

.terms a{
    color: hsl(0, 100%, 74%);
}

.success-message{
    background:hsl(154, 59%, 51%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    font-weight:600;
}
//estilos cuando isSubmitting=true (gracias a reflect: true)//
:host([isSubmitting]) .form-container{     
    opacity: 0.7:
    pointer-events: none;
}
`;
//Metodo del ciclo de vida: se ejecuta después del primer render
//util para manipulación del DOM que requiere que los elementos existan
firstUpdated(){
//Enfocamos automaticamente el primer input cuando el componente se monta
    const firstInput = this.shadowRoot.querySelector('form-input');
    if (firstInput){
//usamos requestanimationframe para asegurar que el DOM este listo 
        requestAnimationFrame(() => {
            firstInput.focus();
});
}
    console.log('Signupform montado y listo');
}

//optimización del rendimiento
// Evita re-renderizar si solo cambian propiedades que no afecta la UI
shouldUpdate(changedProperties){
//si solo cambio isSubmitting y ya está en false no re-renderizar
    if(changedProperties.has('isSubmitting')&&
        !this.isSubmitting &&
        changedProperties.size ===1)
        {
        return false;
    }

//En cualquier otro caso si actualizar 
    return true;

} 
//validar el email usando expresión regular
_validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
//valida todos los campos del formulario
//retorna un ejemplo con los errores encontrados
_validateForm(){
    const newErrors = {};

//validación del first name
if (!this.FormData.firstName.trim()){
    newErrors.firstName = 'First Name cannot be empty';

}  
//validación del last name
if (!this.FormData.lastName.trim()){
    newErrors.lastName = 'Last Name cannot be empty';
}
//validación del email
if (!this.FormData.email.trim()){
    newErrors.email = 'email cannot be empty';
}
else if (!this._validateEmail(this.FormData.email)){
    newErrors.email = 'Looks like this is not an email';

}  
//validación del password
if (!this.FormData.password.trim()){
    newErrors.password= 'password cannot be empty';
}
else if (!this.FormData.password.length <6){
    newErrors.password = 'password must be least 6 characters';  

}
}
}