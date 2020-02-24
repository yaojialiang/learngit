
import ReactTestUtils from "../../lib/ReactTestUtils";

import React from '../../src/May';
import { render } from '../../src/may-dom/MayDom'
var ReactDOM = {
    render: render
}
React.render = render;


// import React from "../../dist/ReactANU";

// var React = require('react');//hyphenate
// var ReactDOM = require('react-dom');

//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
// var ReactDOM = window.ReactDOM || React;

describe("ref", function () {
    // this.timeout(200000);

    var body = document.body,
        div;
    beforeEach(function () {
        div = document.createElement("div");
        body.appendChild(div);
    });
    afterEach(function () {
        body.removeChild(div);
    });
    it("patchRef", function () {
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.handleClick = this
                    .handleClick
                    .bind(this);

            }
            handleClick() {
                // Explicitly focus the text input using the raw DOM API.
                if (this.myTextInput !== null) {
                    this
                        .myTextInput
                        .focus();
                }
            }
            render() {
                return (
                    <div>
                        <input type="text" ref={(ref) => this.myTextInput = ref} />
                        <input
                            ref='a'
                            type="button"
                            value="Focus the text input"
                            onClick={this.handleClick} />
                    </div>
                );
            }
        }

        var s = ReactDOM.render(<App />, div);

        var dom = s.refs.a;
        ReactTestUtils.Simulate.click(dom);
        expect(document.activeElement).toBe(s.myTextInput);
        expect(s.myTextInput).toBeDefined();

    });

    it("patchRef Component", function() {

        class App extends React.Component {
            render() {
                return <div title='1'><A ref='a' /></div>;
            }
        }
        var index = 1;
        class A extends React.Component {
            componentWillReceiveProps() {
                index = 0;
                this.forceUpdate();
            }
            render() {
                return index
                    ? <strong>111</strong>
                    : <em>111</em>;
            }
        }

        var s = ReactTestUtils.renderIntoDocument(<App />);
     
        expect(s.refs.a instanceof A).toBe(true);

    });

    it("没有组件的情况", function() {
        var index = 0;
        function ref(a) {
            index ++;
            expect(a.tagName).toBe("DIV");
        }

        var s = ReactTestUtils.renderIntoDocument(<div ref={ref}></div>);
        expect(index).toBe(1);

    });
    it("should invoke refs in Component.render()", function() {
        var i = 0;
        let outer = function (a) {
            expect(a).toBe(div.firstChild);
            i++;
        };
        let inner = function (a) {
            expect(a).toBe(div.firstChild.firstChild);
            i++;
        };
        class Foo extends React.Component {
            render() {
                return (
                    <div ref={outer}>
                        <span ref={inner} />
                    </div>
                );
            }
        }
        ReactDOM.render(<Foo />, div);
      

        expect(i).toBe(2);
    });
    it("rener方法在存在其他组件，那么组件以innerHTML方式引用子节点，子节点有ref", function() {
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    tip: "g-up-tips",
                    text: "xxxx"
                };

            }

            render() {
                return <div ref='parent' className='parent'>
                    <Child ref='child'>
                        <span ref="inner" className="inner">child</span>
                    </Child>
                </div>;
            }
        }
        class Child extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }

            render() {
                return <div className='child'>{this.props.children}</div>;
            }
        }
        var s = ReactTestUtils.renderIntoDocument(<App />);
      
        expect(Object.keys(s.refs).sort()).toEqual(["child", "inner", "parent"]);

    });
    it("用户在构造器里生成虚拟DOM", function() {
        var a;
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.sliderLeftJSX = this.renderSlider("btnLeft");
                this.state = {};
            }
            renderSlider(which = "btnLeft") {
                return (<span ref={dom => {
                    this[which] = dom;
                }} />);
            }
            componentDidMount() {
                a = !!this.btnLeft;
            }

            render() {
                return (
                    <div >
                        <div className="track" ref="track">
                            {this.sliderLeftJSX}
                        </div>
                    </div>
                );
            }
        }
        var s = ReactTestUtils.renderIntoDocument(<App/>);
    

        expect(a).toBe(true);

    });

    it("Stateless组件也会被执行", function() {
        var b;
        function App() {
            return (
                <div >StateLess</div>
            );
        }
        function refFn(a){
            b = a;
        }
        ReactTestUtils.renderIntoDocument(<App ref={refFn} />);
     
        expect(b).toBe(null);

    });
    it("ReactDOM.render中的元素也会被执行", function() {
        var b;
        function refFn(a){
            b = a;
        }
        ReactTestUtils.renderIntoDocument(<h1 ref={refFn}/>);


        expect(b && b.tagName).toBe("H1");

    });
    it("带ref的组件被子组件cloneElement", function() {
        class Select extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: 1
                };
            }
            render() {
                return React.createElement(SelectTrigger, {
                    ref: "trigger"
                }, React.createElement(
                    "div",
                    {
                        ref: "root"
                    }, "xxxx"));
            }
        }
        class SelectTrigger extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: 2
                };
            }
            render() {
                return React.createElement(Trigger, Object.assign({ title: "xxx" }, this.props), this.props.children);
            }
        }
        class Trigger extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: 2
                };
            }
            render() {
                var props = this.props;
                var children = props.children;
                var child = React.Children.only(children);
                return React.cloneElement(child, { className: "5555" });
            }
        }
        var s = React.render(<Select />, div);
     
        expect(typeof s.refs.root).toBe("object");
        expect(typeof s.refs.trigger).toBe("object");
    });
    it("相同位置上的元素节点的string ref值不一样", function() {
        class Foo extends React.Component {
            render() {
                return (
                    <div>
                        {this.props.a ? <span ref="aaa" className="aaa"/>: <span ref="bbb" className="bbb" />}
                    </div>
                );
            }
        }
        var s = ReactDOM.render(<Foo a={1}/>,  div);
        expect(s.refs.aaa.className).toBe("aaa");
        ReactDOM.render(<Foo a={0}/>, div);
        expect(s.refs.aaa).toBe(undefined);
        expect(s.refs.bbb.className).toBe("bbb");
    });
    it("相同位置上的元素节点的ref类型不一样", function() {
        var a = 1;
        class Foo extends React.Component {
            render() {
                return (
                    <div>
                        {this.props.a ? <span ref="aaa" className="aaa"/>: <span ref={function(b){
                            a = b;
                        }} className="bbb" />}
                    </div>
                );
            }
        }
        var s = ReactDOM.render(<Foo a={1}/>,  div);
        expect(s.refs.aaa.className).toBe("aaa");
        ReactDOM.render(<Foo a={0}/>, div);
        expect(s.refs.aaa).toBe(undefined);
        expect(typeof a).toBe("object");
    });
    it("为元素添加ref", function() {
       
        class Foo extends React.Component {
            render() {
                return (
                    <div>
                        {this.props.a ? <span  className="aaa"/>: <span ref="aaa" className="bbb" />}
                    </div>
                );
            }
        }
        var s = ReactDOM.render(<Foo a={1}/>,  div);
        expect(s.refs).toEqual({});
        ReactDOM.render(<Foo a={0}/>, div);
        expect(typeof s.refs.aaa).toBe("object");
    });
    it("相同位置上的元素节点的ref函数不一样", function() {
        var log = [];
        class Foo extends React.Component {
            render() {
                return (
                    <div>
                        {this.props.a ? <span ref={function(a){
                            log.push(a);
                        }} className="aaa"/>: <b ref={function(a){
                            log.push(a);
                        }} className="bbb" />}
                    </div>
                );
            }
        }
        ReactDOM.render(<Foo a={1}/>,  div);
     
        ReactDOM.render(<Foo a={0}/>, div);
     
        expect(log.length).toBe(3);
        expect(log[1]).toBe(null);
        expect(log[0].nodeName).toBe("SPAN");
        expect(log[2].nodeName).toBe("B");
    });
    it("相同位置上的元素节点的ref函数一样", function() {
        var log = [];
        function refFn(a){
            log.push(a);
        }
        class Foo extends React.Component {
            render() {
                return (
                    <div>
                        {this.props.a ? <span ref={refFn} className="aaa"/>: <b ref={refFn} className="bbb" />}
                    </div>
                );
            }
        }
        ReactDOM.render(<Foo a={1}/>,  div);
     
        ReactDOM.render(<Foo a={0}/>, div);
     
        expect(log.length).toBe(3);
        expect(log[1]).toBe(null);
        expect(log[0].nodeName).toBe("SPAN");
        expect(log[2].nodeName).toBe("B");
    });
    it("组件虚拟DOM的ref总在componentDidMount/Update后才执行", function() {
        var list = [];
        class Static extends React.Component {
            componentDidMount(){
                list.push("static did mount");
            }
            componentWillUpdate(){
                list.push("static will update");
            }
            componentDidUpdate(){
                list.push("static did update");
            }
            render() {
                list.push("static render");
                return <div>{this.props.children}</div>;
            }
        }

        class Component extends React.Component {
            render() {
                if (this.props.flipped) {
                    return (
                        <div>
                            <Static ref={function(b){
                                list.push(b === null ? "null 222":"instance 222");
                            }}>
                           B
                            </Static>
                      
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <Static ref={function(a){
                                list.push(a === null ? "null 111":"instance 111");
                            }} >
                            A
                            </Static>
                        </div>
                    );
                }
            }
        }

        var container = document.createElement("div");
        ReactDOM.render(<Component flipped={false} />, container);
   
        ReactDOM.render(<Component flipped={true} />, container);
        expect(list).toEqual([
            "static render",
            "static did mount",
            "instance 111",
            "null 111",
            "static will update",
            "static render",
            "static did update",
            "instance 222",
        ]);

    });
    it("先执行匹配元素的detach ref，然后卸载组件，最后attach ref",function(){
        var list = [];
        class A extends React.Component{
            componentWillUnmount(){
                list.push("remove");
            }
            render(){
                return <span>A</span>;
            }
        }
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    a: 1
                };
            }
            render() {
                return <div>
                    {
                        this.state.a ? 
                            [<A />,<A />,<A />,<span key="a" ref={(a)=>{
                                list.push(111+  (a ? "instance": "null"));
                            }}>a</span>,<span key="b" ref={(a)=>{
                                list.push(222 + (a ? "instance": "null"));
                                
                            }}>b</span>]:
                            [<span key="b" ref={(a)=>{
                                list.push(333 + (a ? "instance": "null"));
                                
                            }}>b</span>,<span key="a" ref={(a)=>{
                                list.push(444 + (a ? "instance": "null"));
                            }}>a</span>]
                    }
                </div>;
            }
        }
        var s = ReactDOM.render(<App />, div);
        s.setState({a: 0});
        expect(list).toEqual([
            "111instance",
            "222instance",
            "222null",
            "111null",
            "remove",
            "remove",
            "remove",
            "333instance",
            "444instance"
        ]);
    
    });
    it("先执行匹配元素的detach ref，然后更新卸载组件，最后attach ref",function(){
        var list = [];
        class A extends React.Component{
            componentWillUnmount(){
                list.push("A remove");
            }
            componentWillUpdate(){
                list.push("A update");
            }
            render(){
                return <span>A</span>;
            }
        }
        class B extends React.Component{
            componentDidMount(){
                list.push("B mount");
            }
            render(){
                return <span>B</span>;
            }
        }
        var list = [];
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    a: 1
                };
            }
            render() {
                return <div>
                    {
                        this.state.a ? 
                            [<A />,<A />,<A />,
                                <span key="a" ref={(a)=>{
                                    list.push(111+(a?"instance":"null"));
                                }}>a</span>,
                                <span key="b" ref={(a)=>{
                                    list.push(222+(a?"instance":"null"));    
                                }}>b</span>,
                                <span key="c" ref={(a)=>{
                                    list.push(333+(a?"instance":"null"));
                                }}>c</span>,
                            ]:
                            [
                                <span key="b" ref={(a)=>{
                                    list.push(444+(a?"instance":"null"));
                                }}>b</span>,
                                <span key="a" ref={(a)=>{
                                    list.push(555+(a?"instance":"null"));
                                }}>a</span>,<A />, <B />]
                    }
                </div>;
            }
        }
        var s = ReactDOM.render(<App />, div);
        s.setState({a: 0});
        expect(list).toEqual([
            "111instance",
            "222instance",
            "333instance",
            "222null",
            "111null",
            "A update",
            "A remove",
            "A remove",
            "333null",
            "444instance",
            "555instance",
            "B mount"
        ]);
    
    });
    it("ref与生命周期的执行顺序，更新后没有key",function(){
        var list = [];
            
        var A = class extends React.Component {
            componentWillMount() {
                list.push(this.props.name + " componentWillMount");
            }
            render() {
                return <div />;
            }
            componentDidMount() {
                list.push(this.props.name + " componentDidMount");
            }
            componentDidUpdate() {
                list.push(this.props.name + " componentDidUpdate");
            }
            componentWillUnmount() {
                list.push(this.props.name + " componentWillUnmount");
            }
        };
        var B = class extends React.Component {
            componentWillMount() {
                list.push(this.props.name + " componentWillMount");
            }
            render() {
                return <strong />;
            }
            componentDidMount() {
                list.push(this.props.name + " componentDidMount");
            }
            componentWillUnmount() {
                list.push(this.props.name + " componentWillUnmount");
            }
        };
        ReactDOM.render(
            <div>
                <A key="aa" name="a" ref={(a)=>{
                    list.push("a "+!!a)
                    ;
                }}></A>
                <A key="bb" name="b" ref={(a)=>{
                    list.push("b "+!!a)
                    ;
                }}></A>
            </div>,
            div
        );
        list.push("update...");
        ReactDOM.render(
            <div>
                <B  name="c" ref={(a)=>{
                    list.push("c "+!!a);
                }}></B>
                <B  name="d" ref={(a)=>{
                    list.push("d "+!!a)
                    ;
                }}></B>
            </div>,
            div
        );
        expect(list).toEqual([
            "a componentWillMount",
            "b componentWillMount",
            "a componentDidMount",
            "a true",
            "b componentDidMount",
            "b true",
            "update...",
            "c componentWillMount",
            "d componentWillMount",
            "a false",
            "a componentWillUnmount",
            "b false",
            "b componentWillUnmount",
            "c componentDidMount",
            "c true",
            "d componentDidMount",
            "d true"
        ]);
    });
    it("ref与生命周期的执行顺序，更新后有key",function(){
        var list = [];
            
        var A = class extends React.Component {
            componentWillMount() {
                list.push(this.props.name + " componentWillMount");
            }
            render() {
                return <div />;
            }
            componentDidMount() {
                list.push(this.props.name + " componentDidMount");
            }
            componentDidUpdate() {
                list.push(this.props.name + " componentDidUpdate");
            }
            componentWillUnmount() {
                list.push(this.props.name + " componentWillUnmount");
            }
        };
        var B = class extends React.Component {
            componentWillMount() {
                list.push(this.props.name + " componentWillMount");
            }
            render() {
                return <strong />;
            }
            componentDidMount() {
                list.push(this.props.name + " componentDidMount");
            }
            componentWillUnmount() {
                list.push(this.props.name + " componentWillUnmount");
            }
        };
        ReactDOM.render(
            <div>
                <A key="aa" name="a" ref={(a)=>{
                    list.push("a "+!!a)
                    ;
                }}></A>
                <A key="bb" name="b" ref={(a)=>{
                    list.push("b "+!!a)
                    ;
                }}></A>
            </div>,
            div
        );
        list.push("update...");
        ReactDOM.render(
            <div>
                <B key="aa" name="c" ref={(a)=>{
                    list.push("c "+!!a);
                }}></B>
                <B key="bb" name="d" ref={(a)=>{
                    list.push("d "+!!a)
                    ;
                }}></B>
            </div>,
            div
        );
        // "update...", "c componentWillMount", "d componentWillMount", "a false", 
        //"a componentWillUnmount", "b false", "b componentWillUnmount", 
        // expect(list).toEqual([
        //     "a componentWillMount",
        //     "b componentWillMount",
        //     "a componentDidMount",
        //     "a true",
        //     "b componentDidMount",
        //     "b true",
        //     "update...",
        //     "a false",
        //     "a componentWillUnmount",
        //     "c componentWillMount",
        //     "b false",
        //     "b componentWillUnmount",
        //     "d componentWillMount",
        //     "c componentDidMount",
        //     "c true",
        //     "d componentDidMount",
        //     "d true"
        // ]);
    });
});