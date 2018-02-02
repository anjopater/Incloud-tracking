const env = process.env.REACT_APP_ENV || 'development';

// Production and shared settings
let config = {
  API_URL: 'http://localhost:3090',
  DOMAIN: '.dev.story.com'
};

// Override settings according to the enviroment
switch (env) {
  case 'test':
    config.API_URL = '';
    config.DOMAIN = '';
    break;
  case 'production':
    config.API_URL = '';
    config.DOMAIN = '';
    break;
  default:
}

//export const API_URL = config.API_URL;
export default config; 