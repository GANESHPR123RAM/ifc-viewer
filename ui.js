import * as BUI from 'https://unpkg.com/@thatopen/ui?module';
import { loadIfc, exportFragments, disposeFragments } from './viewer.js';

BUI.Manager.init();

const panel = BUI.Component.create(() => {
  return BUI.html`
  <bim-panel active label="IFC Viewer" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
        <bim-button label="Load IFC" @click="${() => loadIfc()}"></bim-button>  
        <bim-button label="Export fragments" @click="${() => exportFragments()}"></bim-button>  
        <bim-button label="Dispose fragments" @click="${() => disposeFragments()}"></bim-button>
      </bim-panel-section>
    </bim-panel-section>
  </bim-panel>
  `;
});
document.body.append(panel);

const toggleBtn = BUI.Component.create(() => {
  return BUI.html`
    <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
      @click="${() => {
        if (panel.classList.contains("options-menu-visible")) {
          panel.classList.remove("options-menu-visible");
        } else {
          panel.classList.add("options-menu-visible");
        }
      }}">
    </bim-button>
  `;
});
document.body.append(toggleBtn);
