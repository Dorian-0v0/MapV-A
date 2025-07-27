// src/utils/eventBus.d.ts
declare const eventBus: {
  on(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  removeAllListeners(): void;
  eventBus()
};

export default eventBus;