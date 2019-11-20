import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import uuidv4 from "uuid/v4"; //create a random string
import firebase from "../../firebase";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

export default class MessageForm extends Component {
  state = {
    message: "",
    loading: false,
    channel: this.props.currentChannel,
    currentUser: this.props.currentUser,
    errors: [],
    modalOpen: false,
    uploadState: "",
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    percentUploaded: 0
  };

  toggleModal = () =>
    this.setState(prevState => {
      return { modalOpen: !prevState.modalOpen };
    });

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value, errors: [] });
  };

  upLoadFile = (file, metadata) => {
    console.log("uploading the file!", file, metadata);
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;

    //set state and then listen for changes
    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          //calback
          err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch(err => {
        console.error(err);
        this.setState({ error: this.state.errors.concat(err) });
      });
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      console.log("We have a message", message);

      this.setState({ loading: true });

      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          console.error(err);
          this.setState(prevState => {
            return { loading: false, errors: prevState.errors.concat(err) };
          });
        });
    } else {
      console.log("We don't have a message", message);
      this.setState(prevState => {
        return {
          errors: prevState.errors.concat({ message: "Add a message" })
        };
      });
    }
  };

  createMessage = (fileUrl = null) => {
    const { currentUser } = this.state;

    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };

    //determine if working with content or image
    if (fileUrl !== null) {
      //add image field to message object
      message["image"] = fileUrl;
    } else {
      //otherwise a content field
      message["content"] = this.state.message;
    }

    return message;
  };

  render() {
    const {
      errors,
      message,
      loading,
      modalOpen,
      uploadState,
      percentUploaded
    } = this.state;
    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          value={message}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="Write your message"
          onChange={this.handleChange}
          className={
            errors.some(err => err.message.includes("message")) ? "error" : ""
          }
        />
        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
            disabled={loading}
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            onClick={this.toggleModal}
            disabled={uploadState === "uploading"}
          />
        </Button.Group>
        <FileModal
          modal={modalOpen}
          closeModal={this.toggleModal}
          uploadFile={this.upLoadFile}
        />
        <ProgressBar uploadStateuploadState percentUploaded={percentUploaded} />
      </Segment>
    );
  }
}
