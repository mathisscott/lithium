import { css } from 'lit-element';

export const styles = css`
  :host {
    --background-color: #f3f3f3;
    --text-color: #2d2d2d;
    background-color: var(--background-color);
    color: var(--text-color);
    margin-bottom: 12px;
    display: flex;
    width: 100%;
    overflow: hidden;
  }

  :host([sticky]) {
    position: fixed;
    z-index: 100;
  }

  ::slotted(a), ::slotted(button) {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 16px;
  }

  ::slotted([li-nav-bar-right]) {
    margin-left: auto;
  }
`;
