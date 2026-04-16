/**
 * A queue utility class to govern async visualization steps sequentially.
 * Useful for decoupling React state from the raw algorithm loop.
 */
export class AnimationQueue<T> {
  private queue: T[] = [];

  enqueue(item: T) {
    this.queue.push(item);
  }

  dequeue(): T | undefined {
    return this.queue.shift();
  }

  peek(): T | undefined {
    return this.queue[0];
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  clear() {
    this.queue = [];
  }
  
  get length(): number {
    return this.queue.length;
  }
}
