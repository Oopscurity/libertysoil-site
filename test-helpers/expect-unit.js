/*eslint-env node, mocha */
import unexpected from 'unexpected';
import unexpectedReact from 'unexpected-react';
import React from 'react';

const expect = unexpected.clone()
  .use(unexpectedReact)
  .use(require('unexpected-dom'))
  .use(require('unexpected-sinon'));

export { unexpected, expect, unexpectedReact, React };
