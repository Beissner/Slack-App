import React, { Component } from 'react';
import firebase from '../../firebase';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Register extends Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    };

    //anonymous function -- doesn't need to be defined by "const"
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        if (this.isFormValid()) {
            //  prevents default behavior of form that reloads page when user clicks to submit
            event.preventDefault();

            const { email, password } = this.state;
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(createdUser => console.log("Created a new user!", createdUser))
                .catch(err => console.log(err));
        }
    }

    isFormValid = () => {
        if (this.isFormEmpty(this.state)) {
            //  throw error
        } else if (!this.isPasswordValid()) {
            //  throw error
        } else {
            // form is valid
            return true;
        }
    }

    isFormEmpty = ({ email, username, password, passwordConfirmation }) => {
        return !email.length || !username.length || !password.length || !passwordConfirmation.length;
    }


    render() {

        const { username, email, password, passwordConfirmation } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="orange" textAlign="center" >
                        <Icon name="puzzle piece" color="orange" />
                        Register for DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment>
                            <Form.Input
                                fluid
                                name="username"
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                value={username}
                                onChange={this.handleChange}
                                type="text" />

                            <Form.Input
                                fluid
                                name="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email Address"
                                value={email}
                                onChange={this.handleChange}
                                type="email"
                            />

                            <Form.Input
                                fluid
                                name="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                value={password}
                                onChange={this.handleChange}
                                type="password"
                            />

                            <Form.Input
                                fluid
                                name="passwordConfirmation"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Password Confirmation"
                                value={passwordConfirmation}
                                onChange={this.handleChange}
                                type="password"
                            />

                            <Button color="orange" fluid size="large">Submit</Button>

                        </Segment>
                    </Form>
                    <Message>Already a user?<Link to="/login"> Login here</Link></Message>
                </Grid.Column>

            </Grid>
        );
    }
}
