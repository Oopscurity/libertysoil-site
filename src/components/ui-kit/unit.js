import React from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import Markdown from 'react-markdown';

import { uiKit } from './util/ui-kit';
import { JSXEditor, LessEditor, Preview } from './playground';

export default class UnitComponent extends React.Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = { docs: {}, jsx: '', isReady: false };

    if (typeof window !== 'undefined') {
      setTimeout(this.tryApplyListeners, 300);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props
      || !isEqual(nextState, this.state);
  }

  tryApplyListeners = () => {
    const unit = uiKit.units.get(this.props.entry.url_name);
    if (!unit) {
      setTimeout(this.tryApplyListeners, 300);
      return;
    }

    this.applyListeners(unit);
    this.handleChange();
  };

  applyListeners = (unit) => {
    unit.addListener('*', this.handleChange);
  };

  handleChange = (event) => {
    const { __path: path } = this.props.entry;
    const mdModule = uiKit.fs.get(path);

    if (!mdModule) {
      return;
    }

    const { examples } = mdModule.exports;
    const nextMd = mdModule.exports.md.split('```KIT_EXAMPLE\n```');

    for (
      let i = 0, j = 1, l = nextMd.length, k = examples.length;
      i < l && i < k;
      ++i, j += 2
    ) {
      nextMd.splice(j, 0, '```KIT_EXAMPLE\n'.concat(examples[i]));
    }

    const nextState = { docs: { md: nextMd, examples }, isReady: true };
    if (!this.state.isReady && this.props.entry.__jsx_default) {
      nextState.jsx = uiKit.fs.get(this.props.entry.__jsx_default).__raw;
    }

    this.setState(nextState);
  };

  // fetchSources = async () => {
  //   const { entry } = this.props;
  //   if (entry) {
  //     const path = entry.js.url;
  //     if (!window.UIKit.fs[path]) {
  //       window.UIKit.fs[path] = {};
  //     }

  //     // TODO: create API for fetching locally during development
  //     const code = await fetch(CONFIG.js.rootpath.concat(path));
  //     this.setState({ jsx: code, isReady: true });
  //     this.handleJSXChange.flush();
  //     this.handleJSXChange(code);
  //   }
  // };

  handleJSXChange = debounce((code) => {
    const path = this.props.entry.js.url;
    const compiled = transformJSX(code, { skipES2015Transform: false });
    const m = getModule(path);

    if (compiled.__code === m.__code) {
      console.log('Nothing changed!');
      return;
    }

    extendModule(path, compiled);
    try {
      extendModule(path, eval(compiled.code));
    } catch (e) {
      console.log(e);
    }
  }, 3000);

  // handleLessChange = () => {

  // };

  render() {
    let index = 0;

    return (
      <div className="layout layout-rows">
        <div className="layout__row">
          {this.state.docs.md && this.state.docs.md.map((chunk, i) => {
            if (chunk.startsWith('```KIT_EXAMPLE\n')) {
              return (
                <Preview
                  code={chunk.replace('```KIT_EXAMPLE\n', '')}
                  index={index++}
                  key={i}
                  urlName={this.props.entry.url_name}
                />
              );
            }

            return <Markdown key={i} source={chunk} />;
          })}
        </div>
        {this.state.isReady &&
          <div className="layout__row">
            <JSXEditor
              code={this.state.jsx}
              onChange={this.handleJSXChange}
            />
          </div>
        }
        <div className="layout__row">
          <LessEditor
            code={this.state.less}
            onChange={this.handleLessChange}
          />
        </div>
      </div>
    );
  }
}

// const mapStateToProps = createSelector(
//   (state, props) => state.getIn(['kit', 'fs', '']),
//   x => ({ x })
// );

// export default connect()(Unit);
