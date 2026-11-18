/**
 * Stops React from listening to `animationiteration` events on its root container.
 *
 * Why: React registers a listener for every DOM event type on its root container, including
 * `animationiteration`, even when no component uses `onAnimationIteration`. As soon as a document has
 * such a listener, the browser must report every loop of every infinite CSS animation. The animated
 * backgrounds run hundreds of them, so this kept waking up the main thread (style recalculation,
 * layout and hit testing several times per frame), which made card flips stutter now and then.
 * Without the listener the background animations run entirely on the compositor.
 *
 * Call it before `createRoot(container)`. The application does not use `onAnimationIteration`
 * (it would not fire on elements rendered in this container).
 */
export const ignoreAnimationIterationListeners = (container: HTMLElement) => {
  const addEventListener = container.addEventListener.bind(container);

  container.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
    if (type === 'animationiteration') return;
    addEventListener(type, listener, options);
  }) as typeof container.addEventListener;
};
