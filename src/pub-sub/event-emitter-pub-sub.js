const EventEmitterPubSub = require('node:events');

// queue
class Notifier extends EventEmitterPubSub {}

// publisher
class UploadService {
  constructor(notifier) {
    this.notifier = notifier;
  }

  upload({ imageId, imageData }) {
    console.log('start uploading photo')
    // upload image to storage
    // ...

    // notify others
    this.notifier.emit('image_upload', { imageId });
  }
}

// Other Workers
class ImageResizerService {
  resize({ imageId }) {
    console.log({ imageId });
    // upload image and resize it

    console.log('resized');
  }
}

class ImageQualityEnhancer {
  enhance({ imageId }) {
    console.log({ imageId });
    // upload image and enhance it

    console.log('enhanced')
  }
}

// usage
const imageResizerService = new ImageResizerService();
const imageQualityEnhancer = new ImageQualityEnhancer();

const notifier = new Notifier();
notifier.on('image_upload', imageResizerService.resize.bind(imageResizerService));
notifier.on('image_upload', imageQualityEnhancer.enhance.bind(imageQualityEnhancer));
const uploader = new UploadService(notifier);

const image = {
  imageData: new ArrayBuffer(),
  imageId: 1,
}

uploader.upload(image);

// But in this example workers can't control the load because
// Notifier sends events as soon as they arrive.