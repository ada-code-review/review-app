import withFirebaseAuth from 'react-with-firebase-auth'
import Firebase from 'firebase';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import React from 'react';
import logo from './logo.svg';
import './App.css';

const firebaseApp = Firebase.initializeApp(firebaseConfig);
console.log(firebaseApp)

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grades: [],
    }
  }
  // this.state = {
  //   grades: [],
  // }
  // state = {
  //   grade

  componentDidMount() {
    console.log("componentDidMount")
    console.log(this.state)
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.writeUserData();
      console.log("componentDidUpdate")
      console.log(this.state)
    }
  }

  writeUserData = () => {
    console.log("writeUserData")
    Firebase.database()
      .ref("/")
      .set(this.state);
    console.log("DATA SAVED");
  };

  getData = () => {
    console.log("getData")
    const ref = Firebase.database().ref("/");
    ref.on("value", snapshot => {
      const state = snapshot.val();
      console.log("database state", state)
      this.setState(state);
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    let color = this.refs.color.value
    let url = this.refs.url.value

    if (url && color) {
      const { grades } = this.state;
      console.log(this.state)
      const gradeIndex = grades.findIndex(data => {
        return data.url === url;
      });
      console.log(gradeIndex)
      if (gradeIndex !== -1) {
        grades[gradeIndex].color = color;
      }
      else {
        grades.push({
            color: color,
            url: url
        })
      }
      this.setState({ grades });
    }
    this.refs.color.value = "";
    this.refs.url.value = "";
  };

  render() {
    const {
      user,
      signOut,
      signInWithGithub,
    } = this.props;

    console.log(`props`, this.props);

      return (
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {
            user
              ? (
                  <React.Fragment>
                    <p>Hello, {user.displayName}</p>
                    <div className="container">
                      <div className="row">
                        <div className="col-xl-12">
                          <h1>Grades</h1>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xl-12">
                          {this.state.grades.map(grade => (
                            <div
                              key={grade.url}
                              className="card float-left"
                              style={{ width: "18rem", marginRight: "1rem" }}
                            >
                              <div className="card-body">
                                <h5 className="card-title">{grade.color}</h5>
                                <h5 className="card-title">{grade.url}</h5>
                                <button
                                  onClick={() => this.removeData(grade)}
                                  className="btn btn-link"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => this.updateData(grade)}
                                  className="btn btn-link"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xl-12">
                          <h1>Add Grade</h1>
                          <form onSubmit={this.handleSubmit}>
                            <div className="form-row">
                              <input type="hidden" ref="url" />
                              <div className="form-group col-md-6">
                                <label>Color</label>
                                <input
                                  type="text"
                                  ref="color"
                                  className="form-control"
                                  placeholder="Red"
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label>Url</label>
                                <input
                                  type="text"
                                  ref="url"
                                  className="form-control"
                                  placeholder="PR-urle"
                                />
                              </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                              Save
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )
              : <p>Please sign in.</p>
          }
          {
            user
              ? <button onClick={signOut}>sign out</button>
              : <button onClick={signInWithGithub}>Sign in with Github</button>
          }
        </header>
      </div>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  githubProvider: new firebase.auth.GithubAuthProvider(),
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
