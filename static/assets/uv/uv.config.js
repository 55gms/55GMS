self.__uv$config = {
  prefix: "/assets/uv/service/",
  bare: "/t/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/assets/uv/uv.handler.js",
  bundle: "/assets/uv/uv.bundle.js",
  config: "/assets/uv/uv.config.js",
  sw: "/assets/uv/uv.sw.js",
};
