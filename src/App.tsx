import React from 'react';
import './styles.css';
import {Route, Switch, Redirect, useRouteMatch} from 'react-router-dom';
import {Issues} from './features/issues';
import {Issue} from './features/issue';
import {defaultRepo} from './config';
import {useGate, useStore} from 'effector-react';
import {$error} from './features/errors.store';
import {repoGate, TRepo} from './features/repository.store';

export default function App() {
  const match = useRouteMatch('/:org/:name')
  const params = (match?.params as TRepo)?.name ? match!.params as TRepo : defaultRepo
  useGate(repoGate, params)

  const error = useStore($error)

  return (
    <div className="App">
      {error ? (
        <div>{error.message}</div>
      ) : (
        <Switch>
          <Route path="/:org/:name" exact>
            <Issues />
          </Route>
          <Route path="/:org/:name/issues/:id">
            <Issue />
          </Route>
          <Route>
            <Redirect to={`/${defaultRepo.org}/${defaultRepo.name}`} />
          </Route>
        </Switch>
      )}
    </div>
  );
}
