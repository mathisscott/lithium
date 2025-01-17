import { LitElement, html, property } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { AriaRole, KeyCodes } from './../utils/enums';
import { stopEvent } from './../utils/events';

export const hiddenButtonTemplate = (disabled: boolean, value: string, name: string, type: 'button' | 'submit' | 'reset' | 'menu') => html`
  <button
    aria-hidden="true"
    ?disabled="${disabled}"
    tabindex="-1"
    style="display: none"
    value="${ifDefined(value)}"
    name="${ifDefined(name)}"
    type="${ifDefined(type)}"
  ></button>
`;

// @dynamic
export class BaseButton extends LitElement {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) type: 'button' | 'submit';
  @property({ type: String, reflect: true }) role = 'button';
  @property({ type: String, reflect: true }) name: string;
  @property({ type: String, reflect: true }) value: string;

  private $hiddenButton: HTMLButtonElement;

  private get isButton() {
    return this.role === AriaRole.Button;
  }

  private get isAnchor() {
    return this.querySelector('a');
  }

  protected render() {
    return html`
      <slot></slot>
      ${hiddenButtonTemplate(this.disabled, this.value, this.name, this.type)}
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.tabIndex = 0;
    this.addEventListener('click', e => this.onClick(e));
    this.addEventListener('keydown', e => this.onKeyDown(e));
  }

  protected firstUpdated(props: Map<string, any>) {
    super.firstUpdated(props);

    if (this.isAnchor) {
      this.role = AriaRole.Presentation;
      this.type = null;
      this.removeAttribute('tabindex');
    } else {
      // append $hiddenButton to light DOM to interface with forms
      this.$hiddenButton = this.shadowRoot.querySelector('button');
      this.appendChild(this.$hiddenButton);
    }

    if (this.disabled) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  protected updated(props: Map<string, any>) {
    super.updated(props);
    if (props.get('disabled') && !this.isAnchor) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  protected onClick(event: Event) {
    if (this.disabled) {
      stopEvent(event);
      return;
    }

    if (this.isButton && event.target === this && !event.defaultPrevented) {
      this.$hiddenButton.dispatchEvent(new MouseEvent('click', { relatedTarget: this, composed: true }));
    }
  }

  protected onKeyDown(e: KeyboardEvent) {
    if ((this.isButton && e.key === KeyCodes.Enter) || e.code === KeyCodes.Space) {
      this.click();
      stopEvent(e);
    }
  }
}
