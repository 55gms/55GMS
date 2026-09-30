// Shared dialog focus management for the existing chat and settings overlays.
(() => {
  let active = null;
  const focusableSelector =
    'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';

  function controls(element) {
    return [...element.querySelectorAll(focusableSelector)].filter(
      (control) => control.getClientRects().length > 0,
    );
  }

  function deactivate(element) {
    if (active?.element !== element) return;
    const previous = active;
    active = null;
    previous.background.forEach(([node, wasInert]) => {
      node.inert = wasInert;
    });
    document.body.style.overflow = previous.overflow;
    if (previous.returnFocus?.isConnected) previous.returnFocus.focus();
  }

  function activate(element, close) {
    if (active?.element === element) return;
    if (active) active.close();
    const returnFocus = document.activeElement;
    const background = [...document.body.children]
      .filter((node) => node !== element && !node.contains(element))
      .map((node) => [node, node.inert]);
    active = {
      element,
      close,
      returnFocus,
      background,
      overflow: document.body.style.overflow,
    };
    background.forEach(([node]) => {
      node.inert = true;
    });
    document.body.style.overflow = "hidden";
    element.tabIndex = -1;
    (controls(element)[0] || element).focus();
  }

  document.addEventListener("keydown", (event) => {
    if (!active || document.querySelector(".swal2-container")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      active.close();
    } else if (event.key === "Tab") {
      const items = controls(active.element);
      const first = items[0] || active.element;
      const last = items.at(-1) || active.element;
      if (
        !active.element.contains(document.activeElement) ||
        (event.shiftKey && document.activeElement === first) ||
        (!event.shiftKey && document.activeElement === last) ||
        !items.length
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
  });

  window.siteDialog = { activate, deactivate };
})();
