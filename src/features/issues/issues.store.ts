import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  guard,
} from 'effector';
import {createGate} from 'effector-react';
import {ErrorMessage, getIssues, Issue, IssuesResult} from '../../api';
import {AxiosError} from 'axios';
import {$error} from '../errors.store';
import {$repository, TRepo, updateRepo} from '../repository.store';
import {routerHistory} from '../../history';
import {getPageFromSearch} from '../../utils';

export const issuesGate = createGate('issue gate');

const pageChanged = createEvent<number | undefined>('page changed');
const routeChanged = pageChanged.prepend(getPageFromSearch);

const fxOnIssues = createEffect<
  {repository: TRepo; page: number},
  IssuesResult,
  ErrorMessage
>({
  async handler({repository: {name, org}, page}) {
    try {
      return await getIssues(org, name, page);
    } catch (err) {
      throw (err as AxiosError<ErrorMessage>).response!.data;
    }
  },
});

const page = createStore(
  getPageFromSearch(routerHistory.location.search) ?? 1,
).reset(guard({source: updateRepo, filter: issuesGate.status}));

const lastPage = createStore(1);
export const $meta = combine({page, lastPage});
export const $issues = createStore<Issue[]>([]);

page.on(pageChanged.filter({fn: Boolean}), (state, payload) => payload);
$issues.on(fxOnIssues.doneData, (_, data) => data.issues);
lastPage.on(fxOnIssues.doneData, (_, payload) => payload.pageCount);

const fxGetIssues = attach({
  source: combine({repository: $repository, page}),
  effect: fxOnIssues,
});

forward({
  from: issuesGate.open,
  to: fxGetIssues,
});

forward({
  from: page.updates,
  to: fxGetIssues,
});

$error.on(fxOnIssues.failData, (state, payload) => payload);

routerHistory.listen((location) => {
  routeChanged(location.search);
});
