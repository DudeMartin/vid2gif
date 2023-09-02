export function preventDefault(listener) {
  return event => {
    event.preventDefault();
    listener(event);
  };
}
