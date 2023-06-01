import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the clmParamEditor extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'clmParamEditor:plugin',
  description: 'A Custom Jupyter Widget Library',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension clmParamEditor is activated!');
  }
};

export default plugin;
