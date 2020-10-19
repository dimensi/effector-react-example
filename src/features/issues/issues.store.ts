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

const getIssuesFx = createEffect<
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
export const issues = createStore<Issue[]>([]);

export const $issuesCombine = combine({
  page,
  lastPage,
  issues,
  repository: $repository,
});

page.on(pageChanged.filter({fn: Boolean}), (state, payload) => payload);
issues.on(getIssuesFx.doneData, (_, data) => data.issues);
lastPage.on(getIssuesFx.doneData, (_, payload) => payload.pageCount);

const attachedGetIssues = attach({
  source: combine({repository: $repository, page}),
  effect: getIssuesFx,
});

forward({
  from: [issuesGate.open, pageChanged, $repository.updates],
  to: attachedGetIssues,
});

$error.on(getIssuesFx.failData, (state, payload) => payload);

routerHistory.listen((location) => {
  const page = getPageFromSearch(location.search);
  if (page) {
    pageChanged(page);
  }
});
