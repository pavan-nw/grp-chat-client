import React from "react";
import io from "socket.io-client";

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      message: "",
      messages: [],
      colors: {},
      chatBoxStyle: { display: "none" },
      joinBtnStyle: { display: "block" }
    };

    const generateColor = author => {
      if (!this.state.colors[author]) {
        const updateColors = this.state.colors;
        updateColors[author] =
          "#" +
          Math.random()
            .toString(16)
            .substr(-6);
        this.setState({ colors: updateColors });
      }
    };

    const addMessage = data => {
      if (this.state.username) {
        generateColor(data.author);
        console.log(this.state.colors);
        data["style"] = {
          color: this.state.colors[data.author],
          padding: 10,
          fontWeight: "bold",
          fontSize: "18px"
        };
        if (data.author === this.state.username) {
          data["style"]["textAlign"] = "right";
        }
        this.setState({ messages: [...this.state.messages, data] });
        console.log(this.state.messages);
      }
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      const sendingMsg = {
        author: this.state.username,
        message: this.state.message
      };
      generateColor(this.state.username);
      this.socket.emit("SEND_MESSAGE", sendingMsg);
      sendingMsg["style"] = {
        color: this.state.colors[this.state.username],
        padding: 10,
        textAlign: "right",
        fontWeight: "bold",
        fontSize: "18px"
      };
      // this.setState({ messages: [...this.state.messages, sendingMsg] });
      this.setState({ message: "" });
    };

    this.joinChat = ev => {
      this.setState({
        chatBoxStyle: { display: "block" },
        joinBtnStyle: { display: "none" }
      });
      // this.socket = io(window.location.hostname);
      this.socket = io(window.location.hostname + ":8090");
      this.socket.on("RECEIVE_MESSAGE", function(data) {
        addMessage(data);
      });
      console.log("emitting SEND_HISTORY");
      this.socket.emit("SEND_HISTORY", this.state.username);

      this.socket.on("RECIEVE_HISTORY" + this.state.username, function(msgs) {
        msgs.forEach(msg => addMessage(msg));
      });
    };

    this.onEnter = ev => {
      ev.preventDefault();
      // Number 13 is the "Enter" key on the keyboard
      if (ev.keyCode === 13) {
        // Trigger the button element with a click
        this.sendMessage(ev);
      }
    };
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  <h2>Group Chat Client</h2>
                </div>
                <div style={this.state.chatBoxStyle}>
                  Logged in user: {this.state.username}
                </div>
                <hr />
                <div className="messages" style={{ minHeight: "350px" }}>
                  {this.state.messages.map(message => {
                    return (
                      <div
                        style={{
                          marginBottom: 10,
                          border: "solid 3px",
                          borderColor: "#0000ff4a",
                          borderRadius: 8
                        }}
                      >
                        <div style={message.style}>
                          {message.author}: {message.message}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="card-footer">
                <input
                  type="text"
                  style={this.state.joinBtnStyle}
                  placeholder="Username"
                  value={this.state.username}
                  onChange={ev => this.setState({ username: ev.target.value })}
                  className="form-control"
                />
                <br />
                <button
                  style={this.state.joinBtnStyle}
                  onClick={this.joinChat}
                  className="btn btn-primary form-control"
                >
                  Join Chat
                </button>
                <br />
                <div style={this.state.chatBoxStyle}>
                  <textarea
                    type="text"
                    onKeyUp={this.onEnter}
                    placeholder="Message"
                    rows="5"
                    className="form-control"
                    value={this.state.message}
                    onChange={ev => this.setState({ message: ev.target.value })}
                  />
                  <br />
                  <button
                    onClick={this.sendMessage}
                    className="btn btn-primary form-control pull-right"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
