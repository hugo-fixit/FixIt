var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// dist/tab-container-element.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var _a;
var _TabContainerChangeEvent_tabIndex;
var _TabContainerChangeEvent_panel;
var _TabContainerChangeEvent_tab;
var _TabContainerElement_instances;
var _TabContainerElement_onTabContainerChange;
var _TabContainerElement_onTabContainerChanged;
var _TabContainerElement_tabList_get;
var _TabContainerElement_tabListWrapper_get;
var _TabContainerElement_tabListTabWrapper_get;
var _TabContainerElement_beforeTabsSlot_get;
var _TabContainerElement_afterTabsSlot_get;
var _TabContainerElement_afterPanelsSlot_get;
var _TabContainerElement_tabListSlot_get;
var _TabContainerElement_panelSlot_get;
var _TabContainerElement_tabs_get;
var _TabContainerElement_setupComplete;
var _TabContainerElement_internals;
var _TabContainerElement_handleKeydown;
var _TabContainerElement_handleClick;
var _TabContainerElement_reflectAttributeToShadow;
var HTMLElement = globalThis.HTMLElement || null;
var assignSlotWithFallback = "assign" in (((_a = globalThis.HTMLSlotElement) === null || _a === void 0 ? void 0 : _a.prototype) || {}) ? (slot, ...elements) => {
  slot.assign(...elements);
} : (slot, ...elements) => {
  const host = slot.getRootNode().host;
  for (const element of host.querySelectorAll(`[slot="${slot.name}"]`)) {
    element.removeAttribute("slot");
  }
  for (const element of elements) {
    element.setAttribute("slot", slot.name);
  }
};
var TabContainerChangeEvent = class extends Event {
  static {
    __name(this, "TabContainerChangeEvent");
  }
  constructor(type, _a2) {
    var { tabIndex, tab, panel } = _a2, init = __rest(_a2, ["tabIndex", "tab", "panel"]);
    super(type, init);
    _TabContainerChangeEvent_tabIndex.set(this, null);
    _TabContainerChangeEvent_panel.set(this, null);
    _TabContainerChangeEvent_tab.set(this, null);
    __classPrivateFieldSet(this, _TabContainerChangeEvent_tab, tab || null, "f");
    __classPrivateFieldSet(this, _TabContainerChangeEvent_tabIndex, tabIndex || null, "f");
    __classPrivateFieldSet(this, _TabContainerChangeEvent_panel, panel || null, "f");
  }
  get detail() {
    console.warn("TabContainerElement.detail is deprecated, please use .panel instead");
    return { relatedTarget: __classPrivateFieldGet(this, _TabContainerChangeEvent_panel, "f") };
  }
  get tabIndex() {
    return __classPrivateFieldGet(this, _TabContainerChangeEvent_tabIndex, "f");
  }
  get panel() {
    return __classPrivateFieldGet(this, _TabContainerChangeEvent_panel, "f");
  }
  get tab() {
    return __classPrivateFieldGet(this, _TabContainerChangeEvent_tab, "f");
  }
};
_TabContainerChangeEvent_tabIndex = /* @__PURE__ */ new WeakMap(), _TabContainerChangeEvent_panel = /* @__PURE__ */ new WeakMap(), _TabContainerChangeEvent_tab = /* @__PURE__ */ new WeakMap();
var TabContainerElement = class extends HTMLElement {
  static {
    __name(this, "TabContainerElement");
  }
  constructor() {
    super(...arguments);
    _TabContainerElement_instances.add(this);
    _TabContainerElement_onTabContainerChange.set(this, null);
    _TabContainerElement_onTabContainerChanged.set(this, null);
    _TabContainerElement_setupComplete.set(this, false);
    _TabContainerElement_internals.set(this, void 0);
  }
  static define(tag = "tab-container", registry = customElements) {
    registry.define(tag, this);
    return this;
  }
  get onChange() {
    return this.onTabContainerChange;
  }
  set onChange(listener) {
    this.onTabContainerChange = listener;
  }
  get onTabContainerChange() {
    return __classPrivateFieldGet(this, _TabContainerElement_onTabContainerChange, "f");
  }
  set onTabContainerChange(listener) {
    if (__classPrivateFieldGet(this, _TabContainerElement_onTabContainerChange, "f")) {
      this.removeEventListener("tab-container-change", __classPrivateFieldGet(this, _TabContainerElement_onTabContainerChange, "f"));
    }
    __classPrivateFieldSet(this, _TabContainerElement_onTabContainerChange, typeof listener === "object" || typeof listener === "function" ? listener : null, "f");
    if (typeof listener === "function") {
      this.addEventListener("tab-container-change", listener);
    }
  }
  get onTabContainerChanged() {
    return __classPrivateFieldGet(this, _TabContainerElement_onTabContainerChanged, "f");
  }
  set onTabContainerChanged(listener) {
    if (__classPrivateFieldGet(this, _TabContainerElement_onTabContainerChanged, "f")) {
      this.removeEventListener("tab-container-changed", __classPrivateFieldGet(this, _TabContainerElement_onTabContainerChanged, "f"));
    }
    __classPrivateFieldSet(this, _TabContainerElement_onTabContainerChanged, typeof listener === "object" || typeof listener === "function" ? listener : null, "f");
    if (typeof listener === "function") {
      this.addEventListener("tab-container-changed", listener);
    }
  }
  get onChanged() {
    return this.onTabContainerChanged;
  }
  set onChanged(listener) {
    this.onTabContainerChanged = listener;
  }
  get activeTab() {
    return __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabs_get)[this.selectedTabIndex];
  }
  get activePanel() {
    return __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_panelSlot_get).assignedNodes()[0];
  }
  get vertical() {
    var _a2;
    return ((_a2 = __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabList_get)) === null || _a2 === void 0 ? void 0 : _a2.getAttribute("aria-orientation")) === "vertical";
  }
  set vertical(isVertical) {
    const tabList = __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabList_get);
    if (tabList && isVertical) {
      tabList.setAttribute("aria-orientation", "vertical");
    } else {
      tabList.setAttribute("aria-orientation", "horizontal");
    }
  }
  connectedCallback() {
    __classPrivateFieldSet(this, _TabContainerElement_internals, __classPrivateFieldGet(this, _TabContainerElement_internals, "f") || (this.attachInternals ? this.attachInternals() : null), "f");
    const shadowRoot = this.shadowRoot || this.attachShadow({ mode: "open", slotAssignment: "manual" });
    const tabListContainer = document.createElement("slot");
    tabListContainer.style.display = "flex";
    tabListContainer.setAttribute("part", "tablist-wrapper");
    tabListContainer.setAttribute("name", "tablist-wrapper");
    const tabListTabWrapper = document.createElement("div");
    tabListTabWrapper.setAttribute("part", "tablist-tab-wrapper");
    tabListTabWrapper.setAttribute("name", "tablist-tab-wrapper");
    const tabListSlot = document.createElement("slot");
    tabListSlot.setAttribute("part", "tablist");
    tabListSlot.setAttribute("name", "tablist");
    tabListTabWrapper.append(tabListSlot);
    const panelSlot = document.createElement("slot");
    panelSlot.setAttribute("part", "panel");
    panelSlot.setAttribute("name", "panel");
    const beforeTabSlot = document.createElement("slot");
    beforeTabSlot.setAttribute("part", "before-tabs");
    beforeTabSlot.setAttribute("name", "before-tabs");
    const afterTabSlot = document.createElement("slot");
    afterTabSlot.setAttribute("part", "after-tabs");
    afterTabSlot.setAttribute("name", "after-tabs");
    tabListContainer.append(beforeTabSlot, tabListTabWrapper, afterTabSlot);
    const afterSlot = document.createElement("slot");
    afterSlot.setAttribute("part", "after-panels");
    afterSlot.setAttribute("name", "after-panels");
    shadowRoot.replaceChildren(tabListContainer, panelSlot, afterSlot);
    if (__classPrivateFieldGet(this, _TabContainerElement_internals, "f") && "role" in __classPrivateFieldGet(this, _TabContainerElement_internals, "f")) {
      __classPrivateFieldGet(this, _TabContainerElement_internals, "f").role = "presentation";
    } else {
      this.setAttribute("role", "presentation");
    }
    this.addEventListener("keydown", this);
    this.addEventListener("click", this);
    this.selectTab(-1);
    if (!__classPrivateFieldGet(this, _TabContainerElement_setupComplete, "f")) {
      const mutationObserver = new MutationObserver(() => {
        this.selectTab(-1);
        if (__classPrivateFieldGet(this, _TabContainerElement_setupComplete, "f")) {
          mutationObserver.disconnect();
        }
      });
      mutationObserver.observe(this, { childList: true, subtree: true });
    }
  }
  attributeChangedCallback(name) {
    if (!this.isConnected || !this.shadowRoot)
      return;
    if (name === "vertical") {
      this.vertical = this.hasAttribute("vertical");
    }
  }
  handleEvent(event) {
    if (event.type === "click")
      return __classPrivateFieldGet(this, _TabContainerElement_instances, "m", _TabContainerElement_handleClick).call(this, event);
    if (event.type === "keydown")
      return __classPrivateFieldGet(this, _TabContainerElement_instances, "m", _TabContainerElement_handleKeydown).call(this, event);
  }
  get selectedTabIndex() {
    return __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabs_get).findIndex((el) => el.matches("[aria-selected=true]"));
  }
  set selectedTabIndex(i) {
    this.selectTab(i);
  }
  get defaultTabIndex() {
    return Number(this.getAttribute("default-tab") || -1);
  }
  set defaultTabIndex(index) {
    this.setAttribute("default-tab", String(index));
  }
  selectTab(index, options = {}) {
    var _a2;
    const { focus = true } = options;
    if (!__classPrivateFieldGet(this, _TabContainerElement_setupComplete, "f")) {
      const tabListSlot = __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabListSlot_get);
      const tabListWrapper = __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabListWrapper_get);
      const customTabList = this.querySelector("[role=tablist]");
      const customTabListWrapper = this.querySelector("[slot=tablist-wrapper]");
      if (customTabListWrapper && customTabListWrapper.closest(this.tagName) === this) {
        assignSlotWithFallback(tabListWrapper, customTabListWrapper);
      } else if (customTabList && customTabList.closest(this.tagName) === this) {
        assignSlotWithFallback(tabListSlot, customTabList);
      } else {
        __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabListTabWrapper_get).role = "tablist";
        assignSlotWithFallback(tabListSlot, ...[...this.children].filter((e) => e.matches("[role=tab]")));
      }
      const tabList = __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabList_get);
      __classPrivateFieldGet(this, _TabContainerElement_instances, "m", _TabContainerElement_reflectAttributeToShadow).call(this, "aria-description", tabList);
      __classPrivateFieldGet(this, _TabContainerElement_instances, "m", _TabContainerElement_reflectAttributeToShadow).call(this, "aria-label", tabList);
      if (this.vertical) {
        __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabList_get).setAttribute("aria-orientation", "vertical");
      }
      const bringsOwnWrapper = ((_a2 = this.querySelector("[slot=tablist-wrapper]")) === null || _a2 === void 0 ? void 0 : _a2.closest(this.tagName)) === this;
      if (!bringsOwnWrapper) {
        const beforeSlotted = [];
        const afterTabSlotted = [];
        const afterSlotted = [];
        let autoSlotted = beforeSlotted;
        for (const child of this.children) {
          if (child.getAttribute("role") === "tab" || child.getAttribute("role") === "tablist") {
            autoSlotted = afterTabSlotted;
            continue;
          }
          if (child.getAttribute("role") === "tabpanel") {
            autoSlotted = afterSlotted;
            continue;
          }
          if (child.getAttribute("slot") === "before-tabs") {
            beforeSlotted.push(child);
          } else if (child.getAttribute("slot") === "after-tabs") {
            afterTabSlotted.push(child);
          } else {
            autoSlotted.push(child);
          }
        }
        assignSlotWithFallback(__classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_beforeTabsSlot_get), ...beforeSlotted);
        assignSlotWithFallback(__classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_afterTabsSlot_get), ...afterTabSlotted);
        assignSlotWithFallback(__classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_afterPanelsSlot_get), ...afterSlotted);
      }
      const defaultTab = this.defaultTabIndex;
      const defaultIndex = defaultTab >= 0 ? defaultTab : this.selectedTabIndex;
      index = index >= 0 ? index : Math.max(0, defaultIndex);
    }
    const tabs = __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabs_get);
    const panels = Array.from(this.querySelectorAll('[role="tabpanel"]')).filter((panel) => panel.closest(this.tagName) === this);
    if (index > tabs.length - 1) {
      return;
    }
    const selectedTab = tabs[index];
    const selectedPanel = panels[index];
    if (!selectedTab)
      return;
    if (!selectedPanel)
      return;
    if (__classPrivateFieldGet(this, _TabContainerElement_setupComplete, "f")) {
      const cancelled = !this.dispatchEvent(new TabContainerChangeEvent("tab-container-change", {
        tabIndex: index,
        bubbles: true,
        cancelable: true,
        tab: selectedTab,
        panel: selectedPanel
      }));
      if (cancelled)
        return;
    }
    for (const tab of tabs) {
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
    }
    for (const panel of panels) {
      if (!panel.hasAttribute("tabindex") && !panel.hasAttribute("data-tab-container-no-tabstop")) {
        panel.setAttribute("tabindex", "0");
      }
    }
    selectedTab.setAttribute("aria-selected", "true");
    selectedTab.setAttribute("tabindex", "0");
    assignSlotWithFallback(__classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_panelSlot_get), selectedPanel);
    selectedPanel.hidden = false;
    if (__classPrivateFieldGet(this, _TabContainerElement_setupComplete, "f")) {
      if (focus) {
        selectedTab.focus();
      }
      this.dispatchEvent(new TabContainerChangeEvent("tab-container-changed", {
        tabIndex: index,
        bubbles: true,
        tab: selectedTab,
        panel: selectedPanel
      }));
    }
    __classPrivateFieldSet(this, _TabContainerElement_setupComplete, true, "f");
  }
};
_TabContainerElement_onTabContainerChange = /* @__PURE__ */ new WeakMap(), _TabContainerElement_onTabContainerChanged = /* @__PURE__ */ new WeakMap(), _TabContainerElement_setupComplete = /* @__PURE__ */ new WeakMap(), _TabContainerElement_internals = /* @__PURE__ */ new WeakMap(), _TabContainerElement_instances = /* @__PURE__ */ new WeakSet(), _TabContainerElement_tabList_get = /* @__PURE__ */ __name(function _TabContainerElement_tabList_get2() {
  const wrapper = this.querySelector("[slot=tablist-wrapper]");
  if ((wrapper === null || wrapper === void 0 ? void 0 : wrapper.closest(this.tagName)) === this) {
    return wrapper.querySelector("[role=tablist]");
  }
  const slot = __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabListSlot_get);
  if (__classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabListTabWrapper_get).hasAttribute("role")) {
    return __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabListTabWrapper_get);
  } else {
    return slot.assignedNodes()[0];
  }
}, "_TabContainerElement_tabList_get"), _TabContainerElement_tabListWrapper_get = /* @__PURE__ */ __name(function _TabContainerElement_tabListWrapper_get2() {
  return this.shadowRoot.querySelector('slot[part="tablist-wrapper"]');
}, "_TabContainerElement_tabListWrapper_get"), _TabContainerElement_tabListTabWrapper_get = /* @__PURE__ */ __name(function _TabContainerElement_tabListTabWrapper_get2() {
  return this.shadowRoot.querySelector('div[part="tablist-tab-wrapper"]');
}, "_TabContainerElement_tabListTabWrapper_get"), _TabContainerElement_beforeTabsSlot_get = /* @__PURE__ */ __name(function _TabContainerElement_beforeTabsSlot_get2() {
  return this.shadowRoot.querySelector('slot[part="before-tabs"]');
}, "_TabContainerElement_beforeTabsSlot_get"), _TabContainerElement_afterTabsSlot_get = /* @__PURE__ */ __name(function _TabContainerElement_afterTabsSlot_get2() {
  return this.shadowRoot.querySelector('slot[part="after-tabs"]');
}, "_TabContainerElement_afterTabsSlot_get"), _TabContainerElement_afterPanelsSlot_get = /* @__PURE__ */ __name(function _TabContainerElement_afterPanelsSlot_get2() {
  return this.shadowRoot.querySelector('slot[part="after-panels"]');
}, "_TabContainerElement_afterPanelsSlot_get"), _TabContainerElement_tabListSlot_get = /* @__PURE__ */ __name(function _TabContainerElement_tabListSlot_get2() {
  return this.shadowRoot.querySelector('slot[part="tablist"]');
}, "_TabContainerElement_tabListSlot_get"), _TabContainerElement_panelSlot_get = /* @__PURE__ */ __name(function _TabContainerElement_panelSlot_get2() {
  return this.shadowRoot.querySelector('slot[part="panel"]');
}, "_TabContainerElement_panelSlot_get"), _TabContainerElement_tabs_get = /* @__PURE__ */ __name(function _TabContainerElement_tabs_get2() {
  var _a2;
  if (__classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabListTabWrapper_get).matches("[role=tablist]")) {
    return __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabListSlot_get).assignedNodes();
  }
  return Array.from(((_a2 = __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabList_get)) === null || _a2 === void 0 ? void 0 : _a2.querySelectorAll('[role="tab"]')) || []).filter((tab) => tab instanceof HTMLElement && tab.closest(this.tagName) === this);
}, "_TabContainerElement_tabs_get"), _TabContainerElement_handleKeydown = /* @__PURE__ */ __name(function _TabContainerElement_handleKeydown2(event) {
  var _a2, _b, _c;
  const tab = (_b = (_a2 = event.target) === null || _a2 === void 0 ? void 0 : _a2.closest) === null || _b === void 0 ? void 0 : _b.call(_a2, '[role="tab"]');
  if (!tab)
    return;
  const tabs = __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabs_get);
  if (!tabs.includes(tab))
    return;
  const currentIndex = this.selectedTabIndex;
  const vertical = ((_c = tab.closest('[role="tablist"]')) === null || _c === void 0 ? void 0 : _c.getAttribute("aria-orientation")) === "vertical";
  const prevTab = event.code === "ArrowLeft" || vertical && event.code === "ArrowUp";
  const nextTab = event.code === "ArrowRight" || vertical && event.code === "ArrowDown";
  if (nextTab) {
    let index = currentIndex + 1;
    if (index >= tabs.length)
      index = 0;
    this.selectTab(index);
  } else if (prevTab) {
    let index = currentIndex - 1;
    if (index < 0)
      index = tabs.length - 1;
    this.selectTab(index);
  } else if (event.code === "Home") {
    this.selectTab(0);
    event.preventDefault();
  } else if (event.code === "End") {
    this.selectTab(tabs.length - 1);
    event.preventDefault();
  }
}, "_TabContainerElement_handleKeydown"), _TabContainerElement_handleClick = /* @__PURE__ */ __name(function _TabContainerElement_handleClick2(event) {
  var _a2, _b;
  const tab = (_b = (_a2 = event.target) === null || _a2 === void 0 ? void 0 : _a2.closest) === null || _b === void 0 ? void 0 : _b.call(_a2, "[role=tab]");
  if (!tab)
    return;
  const tabs = __classPrivateFieldGet(this, _TabContainerElement_instances, "a", _TabContainerElement_tabs_get);
  const index = tabs.indexOf(tab);
  if (index >= 0)
    this.selectTab(index);
}, "_TabContainerElement_handleClick"), _TabContainerElement_reflectAttributeToShadow = /* @__PURE__ */ __name(function _TabContainerElement_reflectAttributeToShadow2(name, node) {
  if (this.hasAttribute(name)) {
    node.setAttribute(name, this.getAttribute(name));
    this.removeAttribute(name);
  }
}, "_TabContainerElement_reflectAttributeToShadow");
TabContainerElement.observedAttributes = ["vertical"];

// dist/tab-container-element-define.js
var root = typeof globalThis !== "undefined" ? globalThis : window;
try {
  root.TabContainerElement = TabContainerElement.define();
} catch (e) {
  if (!(root.DOMException && e instanceof DOMException && e.name === "NotSupportedError") && !(e instanceof ReferenceError)) {
    throw e;
  }
}

// dist/index.js
var index_default = TabContainerElement;
export {
  TabContainerChangeEvent,
  TabContainerElement,
  index_default as default
};
