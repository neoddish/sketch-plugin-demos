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
      info: ""
    };

    window.result = result.bind(this);
  }

  go(msg) {
    console.log("click btn", msg);
    window.postMessage("sayhi", msg);
  }

  render() {
    const { info } = this.state;

    return (
      <>
        <h1>Test</h1>
        <h2>{info}</h2>
        <button
          type="button"
          onClick={() => {
            this.go("hey");
          }}
        >
          Click Me!
        </button>
      </>
    );
  }
}

ReactDOM.render(<AsyncWithReact />, document.getElementById("root"));
