import React, { Component } from 'react';
import firebase from '../../firebase';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Login extends Component {

    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
    };

    //anonymous function -- doesn't need to be defined by "const"
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value, errors: [] });
    }

    handleSubmit = event => {
        //  prevents default behavior of form that reloads page when user clicks to submit
        event.preventDefault();

        if (this.isFormValid(this.state)) {
            //  clear out errors 
            this.setState({ errors: [], loading: true });

            //sign in user
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser);
                    this.setState({ loading: false });
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ errors: this.state.errors.concat(err), loading: false });
                })

        }
    }

    //make sure email and password aren't empty
    isFormValid = ({ email, password }) => email && password;

    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? "error" : ""
    };

    displayErrors = errors => errors.map((error, index) => <p key={index}>{error.message}</p>);


    render() {

        const { email, password, errors, loading } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" icon color="violet" textAlign="center" >
                        <Icon name="code branch" color="violet" />
                        Login to DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment>
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

                            <Button
                                className={loading ? "loading" : ""}
                                disabled={loading}
                                color="violet"
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
                    <Message>Don't have an account?<Link to="/register"> Register here</Link></Message>
                </Grid.Column>

            </Grid>
        );
    }
}
