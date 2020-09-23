import React from 'react';
import './styles.css';
import {Route, Switch, Redirect} from 'react-router-dom';
import {Issues} from './features/issues';
import {Issue} from './features/issue';
import {defaultRepo} from './config';
import {useStore} from 'effector-react';
import {$error} from './features/errors.store';

export default function App() {
  const error = useStore($error)
  return (
    <div className="App">
      {error ? (
        <div>{error.message}</div>
      ) : (
        <Switch>
          <Route path="/:org/:repo" exact>
            <Issues />
          </Route>
          <Route path="/:org/:repo/issues/:id">
            <Issue />
          </Route>
          <Route>
            <Redirect to={`/${defaultRepo.org}/${defaultRepo.repo}`} />
          </Route>
        </Switch>
      )}
    </div>
  );
}
