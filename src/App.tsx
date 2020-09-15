import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Issues } from "./features/issues";
import { Issue } from './features/issue'

export default function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <Issues />
          </Route>
          <Route path="/issues/:id">
            <Issue />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
