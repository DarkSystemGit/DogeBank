import { LitElement, html, render } from "lit";
import { importedStyle, redirect,read } from "./util.js";
export class CompanyItem extends LitElement {
    static properties = {
        company: Object,
    };

    constructor() {
        super();
        //Company is an object like such {name:"companyName",value:Number,logo:"b64-encoded Image",revenue:Data}
        //Data takes the form {"year-month-day(yyyy-mm-dd)":price,...}
        this.company = this.company || {};
        this.data = this.company.revenue || {};
    }

    // Render the UI as a function of component state
    render() {
        return html`
            ${importedStyle(document)}
            <a
                class="round row padding surface-container wave"
                @click="${this.modal}"
            >
                <img class="round" src="${this.company.logo}" />
                <div class="max">
                    <h6 class="small">${this.company.name}</h6>
                    <div>${this.change()}</div>
                </div>
                <i>edit</i>
            </a>
            <comp-modal
                .confirm=${this.editCompany}
                .nav=${true}
                .cancel="${this.modal}"
                id="modal"
            >
                <h4 class="center">Edit ${this.company.name}</h4>
                <img
                    class="circle extra center"
                    id="prof"
                    alt="logo"
                    src=${this.company.logo}
                    style="width:12.5%;height:12.5%;"
                />
                <div class="field label border round jsinput" id="jun">
                    <input
                        type="text"
                        id="name"
                        value="${this.company.name}"
                        placeholder=" "
                    />
                    <label>Name</label>
                </div>
                <div>
                    <label
                        style="white-space: nowrap;gap: .25rem;inline-size: calc(100% - 5rem);transition: all .2s;display: flex;position: absolute;inset: -1.25rem auto auto 1rem;block-size: 1rem;line-height: 1rem;font-size: .75rem;inset-inline-start: 1.5rem;"
                        >Icon</label
                    ><button
                        class="responsive
               "
                    >
                        <i>attach_file</i>
                        <span>Upload Logo</span>
                        <input type="file" @change="${this.logo}" accept="image/*"/>
                    </button>
                </div>
                <div style="padding-top: 1%;">
                    <div style="display: flex;inset-inline-start: 1rem;">
                        <label style="padding-top: .5vh;font-size: 1rem;"
                            >Owners</label
                        >
                        <button class="circle small">
                            <i>add</i>
                        </button>
                    </div>

                    <div style="padding-top: 1%;padding-left: .5%;">
                        ${Object.values(this.company.stockholders).map(
                            (owner) =>
                                html`<a
                                    class="chip fill round small-elevate"
                                    @click=${this.remove}
                                >
                                    <img src="${owner.icon}" />
                                    <span>${owner.name}</span>
                                    <i>close</i>
                                </a>`,
                        )}
                    </div>
                </div>
            </comp-modal>
        `;
    }
    modal() {
        (this.shadowRoot.querySelector("comp-modal") || this).toggle();
    }
    async editCompany(form) {
        console.log(form);
    }
    remove(t) {
        if (Object.keys(this.company.stockholders).length != 1) {
            var elm = t.target;
            var name = elm.querySelector("span").innerText;
            delete this.company.stockholders[name];
            this.shadowRoot.replaceChildren();
            render(this.render(), this.shadowRoot);
        }
    }
    async logo(t){
        var file=await read(t.target.files[0])
        var modal=this.shadowRoot.querySelector("comp-modal").innerNodes()
        this.company.logo=file
        modal.querySelector('#prof').src=file
    }
    change() {
        try {
            var days = Object.values(this.company.revenue).slice(-2);
            var change = days[0] - days[1];
        } catch {
            var change = 0;
        }
        if (change >= 0)
            return html`<p style="color: rgb(8, 153, 129);">
                +${parseFloat(change).toPrecision(3)}
            </p>`;
        return html`<p style="color:rgb(247, 82, 95);">
            ${parseFloat(change).toPrecision(3)}
        </p>`;
    }
}
