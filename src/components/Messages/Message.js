import React, { Component } from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

export default class Message extends Component {
  isOwnMessage = (message, user) => {
    //if user wrote this message give a special class
    return message.user.id === user.uid ? "message__self" : "";
  };

  isImage = message => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  timeFromNow = timestamp => moment(timestamp).fromNow();

  render() {
    const { message, key, user } = this.props;

    return (
      <Comment>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content className={this.isOwnMessage(message, user)}>
          <Comment.Author as="a">{message.user.name}</Comment.Author>
          <Comment.Metadata>
            {this.timeFromNow(message.timestamp)}
          </Comment.Metadata>

          {this.isImage(message) ? (
            <Image src={message.image} className="message__image" />
          ) : (
            <Comment.Text>{message.content}</Comment.Text>
          )}
        </Comment.Content>
      </Comment>
    );
  }
}
