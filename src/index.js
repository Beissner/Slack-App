import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import firebase from "./firebase";
//   using Semantic UI for styling
import "semantic-ui-css/semantic.min.css";
//withRouter is a HOC that allows us access to history object
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import rootReducer from "./redux/reducers";
import { setUser, clearUser } from "./redux/actions";
import Spinner from "./components/common/Spinner";

//create store variable
const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() {
    //listener that recognizes if user had logged in recently
    firebase.auth().onAuthStateChanged(user => {
      //if user is authenticated then send to App home page
      if (user) {
        console.log("authenticated user exists: ", user);
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
});

//withRouter is Higher Order Component (HOC) that allows us to use history
//connect takes mapStateFromProps and mapDispatchToProps (here we are deconstructing)?
//this allows us to use setUser()
const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    { setUser, clearUser }
  )(Root)
);

//to use redux must wrap Router with <Provider>
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
