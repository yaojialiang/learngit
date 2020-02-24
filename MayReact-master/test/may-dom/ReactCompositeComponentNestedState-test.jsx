import PropTypes from '../../lib/ReactPropTypes';
import ReactTestUtils from "../../lib/ReactTestUtils";
import React from '../../src/May';
import { render, unmountComponentAtNode, findDOMNode } from '../../src/may-dom/MayDom'
var ReactDOM = {
    render: render,
    unmountComponentAtNode: unmountComponentAtNode,
    findDOMNode: findDOMNode
}
React.render = render;


// import React from "../../dist/ReactANU";
// var ReactDOM = React;
// var ReactTestUtils = { Simulate: {} };
// "click,change,keyDown,keyUp,KeyPress,mouseDown,mouseUp,mouseMove".replace(/\w+/g, function (name) {
//     ReactTestUtils.Simulate[name] = function (node, opts) {
//         if (!node || node.nodeType !== 1) {
//             throw "第一个参数必须为元素节点";
//         }
//         var fakeNativeEvent = opts || {};
//         fakeNativeEvent.target = node;
//         fakeNativeEvent.simulated = true;
//         fakeNativeEvent.type = name.toLowerCase();
//         React.eventSystem.dispatchEvent(fakeNativeEvent, name.toLowerCase());
//     };
// });

//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js

describe("ReactCompositeComponentNestedState-state", function() {
    //this.timeout(200000);


    it('should provide up to date values for props', () => {
    class ParentComponent extends React.Component {
      state = {color: 'blue'};

      handleColor = color => {
        this.props.logger('parent-handleColor', this.state.color);
        this.setState({color: color}, function() {
          this.props.logger('parent-after-setState', this.state.color);
        });
      };

      render() {
        this.props.logger('parent-render', this.state.color);
        return (
          <ChildComponent
            logger={this.props.logger}
            color={this.state.color}
            onSelectColor={this.handleColor}
          />
        );
      }
    }

    class ChildComponent extends React.Component {
      constructor(props) {
        super(props);
        props.logger('getInitialState', props.color);
        this.state = {hue: 'dark ' + props.color};
      }

      handleHue = (shade, color) => {
        this.props.logger('handleHue', this.state.hue, this.props.color);
        this.props.onSelectColor(color);
        this.setState(
          function(state, props) {
            this.props.logger(
              'setState-this',
              this.state.hue,
              this.props.color,
            );
            this.props.logger('setState-args', state.hue, props.color);
            return {hue: shade + ' ' + props.color};
          },
          function() {
            this.props.logger(
              'after-setState',
              this.state.hue,
              this.props.color,
            );
          },
        );
      };

      render() {
        this.props.logger('render', this.state.hue, this.props.color);
        return (
          <div>
            <button onClick={this.handleHue.bind(this, 'dark', 'blue')}>
              Dark Blue
            </button>
            <button onClick={this.handleHue.bind(this, 'light', 'blue')}>
              Light Blue
            </button>
            <button onClick={this.handleHue.bind(this, 'dark', 'green')}>
              Dark Green
            </button>
            <button onClick={this.handleHue.bind(this, 'light', 'green')}>
              Light Green
            </button>
          </div>
        );
      }
    }

    var container = document.createElement('div');
    document.body.appendChild(container);
    var list = []
    function logger(){
      list.push([].slice.call(arguments, 0))
    }

    void ReactDOM.render(<ParentComponent logger={logger} />, container);

    // click "light green"
    ReactTestUtils.Simulate.click(container.childNodes[0].childNodes[3]);
    //console.log(JSON.stringify(logger.calls))
    expect(list).toEqual([
      ['parent-render', 'blue'],
      ['getInitialState', 'blue'],
      ['render', 'dark blue', 'blue'],
      ['handleHue', 'dark blue', 'blue'],
      ['parent-handleColor', 'blue'],
      ['parent-render', 'green'],
      ['setState-this', 'dark blue', 'blue'],
      ['setState-args', 'dark blue', 'green'],
      ['render', 'light green', 'green'],
      ['parent-after-setState', 'green'],
      ['after-setState', 'light green', 'green']
     
    ]);
  });


});