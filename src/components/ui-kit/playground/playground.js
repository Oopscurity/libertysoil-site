import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import createSelector from '../../../selectors/createSelector';
import EditorGroup from './editor-group';

class Playground extends React.Component {
  static defaultProps = {
    sections: List()
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.sections.size !== this.props.sections.size;
  }

  render() {
    return (
      <div className="kit-playground">
        {this.props.sections.map((section, i) =>
          <EditorGroup
            index={i}
            key={i}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.getIn(['kit', 'playground', 'sections']),
  sections => ({ sections })
);

export default connect(mapStateToProps)(Playground);
