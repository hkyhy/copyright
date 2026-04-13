const { generateCopyright } = require('./generator');
const { generateModule } = require('./module-generator');
const { MODULES } = require('./module-config');

module.exports = {
  generateCopyright,
  generateModule,
  MODULES
};
