import React, { Component } from 'react';
import firebase from '../../firebase';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import md5 from 'md5';

export default class Register extends Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')  //reference to Realtime database
    };

    //anonymous function -- doesn't need to be defined by "const"
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value, errors: [] });
    }

    handleSubmit = event => {
        //  prevents default behavior of form that reloads page when user clicks to submit
        event.preventDefault();

        if (this.isFormValid()) {
            //  clear out errors 
            this.setState({ errors: [], loading: true });

            const { email, password } = this.state;
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(createdUser => {
                    //this.setState({ loading: false });

                    console.log('createdUser object', createdUser);
                    //the object we get back has several useful fields/methods we can use
                    //use "displayName" to store username
                    //use "photoURL" to store user photo

                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar/com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                        .then(() => {
                            this.saveUser(createdUser).then(() => {
                                this.setState({ loading: false });
                            })
                                .catch(err => console.error("failed to save user", err));
                        })
                        .catch(err => {
                            console.error(err);
                            this.setState({ errors: this.state.errors.concat(err), loading: false });
                        });
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ loading: false, errors: this.state.errors.concat(err) });
                });
        }
    }

    // saving to Firebase Realtime Database -- must first set up database
    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        //must be at least 6 char long
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    }

    isFormValid = () => {
        let errors = [];
        let error;

        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all fields' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            error = { message: 'Password is invalid' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            // form is valid
            return true;
        }
    }

    isFormEmpty = ({ email, username, password, passwordConfirmation }) => {
        return !email.length || !username.length || !password.length || !passwordConfirmation.length;
    }

    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? "error" : ""
    };

    displayErrors = errors => errors.map((error, index) => <p key={index}>{error.message}</p>);


    render() {

        const { username, email, password, passwordConfirmation, errors, loading } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" icon color="orange" textAlign="center" >
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
                                type="text"
                            />

                            <Form.Input
                                fluid
                                name="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email Address"
                                value={email}
                                onChange={this.handleChange}
                                type="email"
                                className={this.handleInputError(errors, 'email')}
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
                                className={this.handleInputError(errors, 'password')}
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
                                className={this.handleInputError(errors, 'password')}
                            />

                            <Button
                                className={loading ? "loading" : ""}
                                disabled={loading}
                                color="orange"
                                fluid
                                size="large"
                            >
                                Submit
                            </Button>

                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already a user?<Link to="/login"> Login here</Link></Message>
                </Grid.Column>

            </Grid>
        );
    }
}
