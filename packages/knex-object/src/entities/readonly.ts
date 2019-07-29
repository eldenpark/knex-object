export default function readonly(target, key, descriptor) {
  // descriptor.writable = false; // eslint-disable-line
  descriptor.configurable = false; // eslint-disable-line
}
