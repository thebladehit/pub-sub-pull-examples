// Instead of array we can use LinkedList
class Queue {
  #messages = [];
  #inProcessMessages = [];
  #timeout;

  constructor(timeout) {
    this.#timeout = timeout;
  }

  push(messageData) {
    const msgId = Math.random() + Date.now();
    this.#messages.push({
      data: messageData,
      id: msgId,
    });
  }

  pull() {
    const message = this.#messages.shift();
    if (!message) {
      return null;
    }
    this.#inProcessMessages.push(message);
    setTimeout(() => this.#onTimeout(message), this.#timeout);
    return message;
  }

  acknowledge(messageId) {
    const isProcessing = this.#inProcessMessages.find(({ id }) => id === messageId);
    if (!isProcessing) {
      throw new Error(`Message ${messageId} is not in processing`);
    }
    this.#inProcessMessages = this.#inProcessMessages.filter(({ id }) => id !== messageId);
  }

  #onTimeout(message) {
    const isProcessing = this.#inProcessMessages.some(({ id }) => id === message.id);
    if (isProcessing) {
      console.log('Queue: onTimeout', message);
      this.#messages.push(message);
    }
    this.#inProcessMessages = this.#inProcessMessages.filter(({ id }) => id !== message.id);
  }
}

// publisher
class UploadService {
  #queue;

  constructor(queue) {
    this.#queue = queue;
  }

  upload({ imageId, imageData }) {
    console.log(`Uploader: uploading photo with id ${imageId}`);
    // upload image to storage
    // ...

    this.#queue.push({ eventName: 'image_uploaded', imageId });
  }
}

// worker
class ImageResizerService {
  #queue;

  constructor(queue) {
    this.#queue = queue;
  }

  async start() {
    while(true) {
      try {
        const message = this.#queue.pull();
        if (!message) {
          await this.#wait(500);
          continue;
        }
        console.log('Worker: message received');
        await this.resize(message);
        this.#queue.acknowledge(message.id);
        console.log(`Worker: message acknowledged ${message.id}`);
      } catch (err) {
        console.log(`Worker: message acknowledge on timeout: ${err}`);
      }
    }
  }

  async resize({ imageId }) {
    // upload and resize image
    return new Promise(resolve => {
      setTimeout(resolve, Math.random() * 1000);
    })
  }

  #wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}


//usage
const queue = new Queue(600);
const publisher = new UploadService(queue);
const firstWorker = new ImageResizerService(queue);
const secondWorker = new ImageResizerService(queue);

firstWorker.start();
secondWorker.start();

let imageId = 0;

setInterval( () => {
  publisher.upload({
    imageData: new ArrayBuffer(),
    imageId: imageId++,
  });
}, 500);

// This implementation allows workers to pull messages,
// process and then acknowledge them.
// If messages is not acknowledged before the timeout,
// the message is returned to queue and another worker can
// process it.

