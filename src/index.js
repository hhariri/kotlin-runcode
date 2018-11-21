import {RUNTIME_CONFIG, API_URLS} from './config';
import ExecutableCode from './executable-code';
import {getConfigFromElement, getCurrentScript, waitForNode} from './utils';
import {
  default as discoursePreviewPanelHandler,
  Selectors as DiscourseSelectors
} from './discourse-preview-panel-handler';

/**
 *
 * @typedef {Object} eventFunctions
 * @property {Function} onChange
 * @property {Function} onTestPassed
 * @property {Function} onConsoleOpen
 * @property {Function} onConsoleClose
 * @property {Function} callBack
 *
 * @param {string} selector
 * @param {Function} eventFunctions
 * @param {string} server
 * @return {Promise<Array<ExecutableCode>>}
 */
export default function create(selector, eventFunctions, server) {
  API_URLS.server = server || API_URLS.server;
  return ExecutableCode.create(selector, eventFunctions);
}

// Backwards compatibility, should be removed in next major release
create.default = create;

/**
 * Initialize Kotlin playground for Discourse platform
 * @param {string} selector
 * @return {Promise<Array<ExecutableCode>>}
 */
create.discourse = function (selector) {
  discoursePreviewPanelHandler();
  return create(selector);
};

// Auto initialization via data-selector <script> attribute
const {selector, discourseSelector} = RUNTIME_CONFIG;

if (selector || discourseSelector) {
  document.addEventListener('DOMContentLoaded', () => {
    if (discourseSelector) {
      create.discourse(discourseSelector);
      waitForNode(DiscourseSelectors.PREVIEW_PANEL, () => discoursePreviewPanelHandler());
    } else {
      create(selector);
    }
  });
}
