type ToastHandler = (message: string) => void;

let handler: ToastHandler = () => {};

export function onToast(next: ToastHandler) {
  handler = next;
  return () => {
    if (handler === next) handler = () => {};
  };
}

export function showToast(message: string) {
  handler(message);
}
