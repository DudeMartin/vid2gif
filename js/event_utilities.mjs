export function preventDefault(listener) {
  return event => {
    event.preventDefault();
    listener(event);
  };
}

export function toggleState(element, stateOne, stateTwo, stateOneCallback = () => {}, stateTwoCallback = () => {}) {
  if (element.getAttribute("data-state") === stateOne) {
    stateOneCallback(element);
    element.setAttribute("data-state", stateTwo);
  } else {
    stateTwoCallback(element);
    element.setAttribute("data-state", stateOne);
  }
}
