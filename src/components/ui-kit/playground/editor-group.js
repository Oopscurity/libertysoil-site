import React from 'react';
import { connect } from 'react-redux';

import createSelector from '../../../selectors/createSelector';

class EditorGroup extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps !== this.props;
  }

  render() {
    const { tabs, openTabPath } = this.props;

    let openTab;
    if (openTabPath) {
      openTab = tabs.find(t => t.get('path') === openTabPath);
    }

    return (
      <div className="kit-editor__section">
        {tabs.map(tab =>
          <Tab

          />
        )}
        {openTab}
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  
);

export default connect(mapStateToProps)(EditorGroup);
