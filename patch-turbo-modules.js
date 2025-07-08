// Patch para resolver problemas com TurboModuleRegistry no React Native 0.79.5
if (typeof global.TurboModuleRegistry === 'undefined') {
  global.TurboModuleRegistry = {
    get: (name) => null,
    getEnforcing: (name) => {
      throw new Error(`TurboModule ${name} not found`);
    },
  };
}

// Patch para garantir que __turboModuleProxy existe
if (typeof global.__turboModuleProxy === 'undefined') {
  global.__turboModuleProxy = (name) => null;
}

export {};