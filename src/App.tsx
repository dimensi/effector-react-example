import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Issues } from "./features/issues";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/">
            <Issues />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
