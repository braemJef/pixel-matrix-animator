function nonBlockingTask(task, ms = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      task();
      resolve();
    }, ms);
  });
}

export default nonBlockingTask;
