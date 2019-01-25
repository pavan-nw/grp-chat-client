import React from "react";
import io from "socket.io-client";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            message: '',
            messages: [],
            colors: {

            },
            chatBoxStyle: {display:'none'},
            joinBtnStyle: {display:'block'},
        };

        this.socket = io(window.location.hostname);

        const generateColor = (author) => {
            if (!this.state.colors[author]) {
                const updateColors = this.state.colors;
                updateColors[author] = '#' + Math.random().toString(16).substr(-6);
                this.setState({ colors: updateColors })
            }
        }

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        const addMessage = data => {
            if (this.state.username && data.author !== this.state.username) {
                generateColor(data.author)
                console.log(this.state.colors);
                data['style'] = {
                    color: this.state.colors[data.author],
                    padding: 10,
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
            }
            generateColor(this.state.username);
            this.socket.emit('SEND_MESSAGE', sendingMsg)
            sendingMsg['style'] = {
                color: this.state.colors[this.state.username],
                padding: 10,
                textAlign: 'right',
            }
            this.setState({ messages: [...this.state.messages, sendingMsg] });
            this.setState({message: ''});

        }

        this.joinChat = ev => {
            this.setState({chatBoxStyle: {display:'block'}, joinBtnStyle: {display:'none'}});
        }
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">Group Chat Client</div>
                                <hr />
                                <div className="messages" style={{minHeight: '250px'}}>
                                    {this.state.messages.map(message => {
                                        return (
                                            <div className="card" style={{
                                                marginBottom: 10,
                                            }}>
                                                <div style={message.style}>{message.author}: {message.message}
                                                 
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                            <div className="card-footer">
                                <input type="text" style={this.state.joinBtnStyle} placeholder="Username" value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} className="form-control" />
                                <br />
                                <button style={this.state.joinBtnStyle} onClick={this.joinChat} className="btn btn-primary form-control">Join Chat</button>
                                <br />
                                <div style={this.state.chatBoxStyle}>
                                <textarea type="text" placeholder="Message" rows="5" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                                <br />
                                <button onClick={this.sendMessage} className="btn btn-primary pull-right">Send</button>
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