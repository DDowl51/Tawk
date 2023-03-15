const debounce = (fn: Function, timeout: number) => {
  let timer: NodeJS.Timer;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), timeout);
  };
};

export default debounce;
