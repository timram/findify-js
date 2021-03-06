declare module window {
  const findifyCallback: Promise<any> | undefined | any
}

export default root => new Promise(resolve => {
  const callbacks = window.findifyCallbacks = window.findifyCallbacks || [];
  window.findifyCallbacks.push = (cb) => cb(root);
  if (!callbacks) return resolve();
  const promises = [];
  for (let index = 0; index < callbacks.length; index++) {
    const callback = callbacks[index];
    if (callback instanceof Promise) {
      promises.push(callback(root));
    } else {
      callback(root);
    }
  }
  return Promise.all(promises).then(resolve);
});
