import React from 'react';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

import createSelector from '../../../selectors/createSelector';
import { uiKit } from '../util/ui-kit';
import Unit from '../util/unit';

class ExamplePreview extends React.Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = { code: props.code };

    if (typeof window === 'undefined') {
      this.example = { __module: { default: () => {} } };
    } else {
      const unit = uiKit.units.get(this.props.urlName);
      this.example = Unit.getExample(unit, this.props.index);
    }
  }

  render() {
    let body;
    const Component = this.example.exports.default;
    if (Component instanceof Function) {
      body = <Component />;
    } else {
      body = Component;
    }

    return (
      <div className="layout">
        {body}
      </div>
    );
    // code editor expected
  }
}

const mapStateToProps = createSelector(
  (state, props) => state.getIn(['kit', 'docs', props.urlName, props.index]),
  code => ({ code })
);

export default connect()(ExamplePreview);
