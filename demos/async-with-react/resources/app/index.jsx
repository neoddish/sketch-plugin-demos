import React from "react";
import ReactDOM from "react-dom";

import "./index.less";

function result(s) {
  console.log("result");
  console.log(s);

  this.setState({ info: s });
}

class AsyncWithReact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: "info",
      toggle: true
    };

    window.result = result.bind(this);
  }

  go(msg) {
    console.log("click btn", msg);
    this.setState({ info: "pending..." });
    window.postMessage("sayhi", msg);
  }

  render() {
    const { info, toggle } = this.state;

    const switchToggle = () => {
      const { toggle } = this.state;
      this.setState({ toggle: !toggle });
    };

    return (
      <>
        <h1>Test</h1>
        <p>Click 'start' and then try to keep switching toggle.</p>
        <h2>{info}</h2>
        <h3>{toggle ? "aaa" : "bbb"}</h3>
        <button
          type="button"
          onClick={() => {
            this.go("hey");
          }}
        >
          start
        </button>
        <button type="button" onClick={switchToggle}>
          toggle
        </button>
      </>
    );
  }
}

ReactDOM.render(<AsyncWithReact />, document.getElementById("root"));
