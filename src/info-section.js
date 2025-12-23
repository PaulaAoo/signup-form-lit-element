import { html, css, LitElement } from 'lit';

class InfoSection extends LitElement {
    static get properties() {
        return {
            title: { type: String },
            description: { type: String }
        }

    };

    static styles = css`
        :host {
            display: block;
            color: white;
        }
        
        h1 {
            font-size: 50px;
            font-weight: 700;
            line-height: 1.1;
            margin: 0 0 30px 0;
        }
        
        p {
            font-size: 16px;
            font-weight: 400;
            line-height: 1.6;
            opacity: 0.9;
            margin: 0;
        }
        
        /* Responsive para móvil */
        @media (max-width: 768px) {
            h1 {
                font-size: 28px;
                line-height: 1.3;
            }
            
            p {
                font-size: 16px;
            }
        }
    `;


    constructor() {
        super();
        this.title = 'Learn to code by watching others';
        this.description = 'See how experienced developers solve problems in real-time. Watching scripted tutorials is great, but understanding how developers think is invaluable.';
    }

    render() {
        return html`
            <h1>${this.title}</h1>
            <p>${this.description}</p>
        `;
    }
}

customElements.define('info-section', InfoSection);