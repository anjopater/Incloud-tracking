import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import WebFont from 'webfontloader';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from '../src/components/App';

WebFont.load({
  google: {
    families: ['Open+Sans:300,300i,400,400i,600,600i,700,700i', 'Material+Icons']
  },
  fontinactive: function (familyName) {
    if (familyName === 'Material Icons') {
      require('material-design-icons/iconfont/material-icons.css');
    }
  }
});

ReactDOM.render(
  <App/>, document.getElementById('root'));

registerServiceWorker();
