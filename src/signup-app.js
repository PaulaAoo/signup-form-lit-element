import { LitElement, html, css } from 'lit';
<<<<<<< HEAD
import './info-section.js';
// import './signup-    form.js'; // Comentado temporalmente

=======
>>>>>>> f408db5ff065616cfb847dd02af8e4cc999763d8
class SignupApp extends LitElement {
    static styles = css`
     /* var colors design */
    :host {
        display: block;
        min-height: 100vh;
        font-family: 'Poppins', sans-serif;
        
        /* Primary Colors */
        --red-400: hsl(0, 100%, 74%);
        --green-400: hsl(154, 59%, 51%);
  
        /* Accent */
        --purple-700: hsl(248, 32%, 49%);
  
        /* Neutral */
        --gray-900: hsl(249, 10%, 26%);
        --purple-350: hsl(246, 25%, 77%);
  
        /* Typography */
        --font-family: 'Poppins', sans-serif;
        --font-size-base: 16px;
    }
    .container {
     min-height: 100vh;
     background-color: var(--red-400);
     background-image: url('/src/assets/bg-intro-desktop.png');
     background-size: cover;
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 45px;
     align-items: center;
     padding: 0 165px;
    }
    .left-side {
        color: white;
    }
    .left-side h1 {
        font-size: 50px;
        font-weight: 700;
        line-height: 1.1;
        margin-bottom: 30px;
    }
    .left-side p {
        font-size: 16px;
        font-weight: 400;
        line-height: 1.6;
        opacity: 0.9;
    }
    .right-side {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
    
    .promo-banner {
        background-color: var(--purple-700);
        color: white;
        text-align: center;
        padding: 18px;
        border-radius: 10px;
        box-shadow: 0 8px 0 rgba(0, 0, 0, 0.15);
    }
    
    .promo-banner p {
        margin: 0;
        font-size: 15px;
        font-weight: 400;
    }
    
    .promo-banner strong {
        font-weight: 700;
    }
    
    .form-container {
        background-color: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 8px 0 rgba(0, 0, 0, 0.15);
    }
    /* responsive movile, one column */
    @media (max-width: 768px) {
        .container {
            grid-template-columns: 1fr;
            padding: 88px 24px;
            gap: 64px;
            text-align: center;
        }
        .left-side h1 {
            font-size: 28px;
            line-height: 1.3;
        }
        .left-side p {
            font-size: 16px;
        }
    }
    `;
    
    render() {
        return html`
        <div class="container">
            <div class="left-side">
                <info-section></info-section>
            </div>
            <div class="right-side">
                <div class="promo-banner">
                    <p> <strong>Try it free 7 days</strong> then $20/mo. thereafter</p>
                </div>
                <div class="form-container">
                    <p style="color: #999; text-align: center; padding: 40px 0;">
                        Aquí irá el formulario de registro :)
                    </p>
                    <!-- <signup-form></signup-form> -->
                </div>
                
            </div>
        </div>
        `;
    }
    _onFormSubmitted(e) {
        console.log('formulario enviado',e.detail.formData);
    }
}
customElements.define('signup-app', SignupApp); 