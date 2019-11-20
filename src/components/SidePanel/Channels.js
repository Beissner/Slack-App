import React, { Component } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../redux/actions";

class Channels extends Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    modalOpen: false,
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    firstLoad: true,
    activeChannel: ""
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    //remove listeners when routing somewhere else
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.channelsRef.off();
  };

  //whenever a channel is added this listener adds it to state
  //do we need to call this every time in compoenentDidMount??
  addListeners() {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      console.log(loadedChannels);
    });
  }

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];

    if (this.state.firstLoad && this.state.channels.length > 0) {
      //set first channel in array as the default we see
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;

    //get a unique key for every channel added
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        console.log("added channel");
        this.setState({ channelName: "", channelDetails: "" });
      })
      .catch(err => console.error("Faild to save channel. ERROR: ", err));
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  handleSubmit = event => {
    event.preventDefault();

    const isFormValid = ({ channelName, channelDetails }) =>
      channelName && channelDetails;

    if (isFormValid(this.state)) {
      console.log("form valid");
      this.addChannel();
      this.toggleModal();
    } else {
      console.log("form NOT valid");
    }
  };

  toggleModal = () =>
    this.setState(prevState => {
      return { modalOpen: !prevState.modalOpen };
    });

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { channels, modalOpen } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" onClick={this.toggleModal} />
          </Menu.Item>

          {this.displayChannels(channels)}
        </Menu.Menu>

        <Modal basic open={modalOpen} onClose={this.toggleModal}>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.toggleModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel }
)(Channels);
