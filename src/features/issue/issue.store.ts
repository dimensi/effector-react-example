import {createGate} from 'effector-react';
import {attach, createEffect, createStore, forward} from 'effector';
import {Comment, ErrorMessage, getComments, getIssue, Issue} from '../../api';
import {AxiosError} from 'axios';
import {$error} from '../errors.store';
import {$repository, TRepo} from '../repository.store';

export interface IssueRouteParams {
  id: string;
}

type OnGetIssueParams = TRepo & IssueRouteParams;

export const issueGate = createGate<IssueRouteParams>('issue gate');

const onGetIssue = createEffect<OnGetIssueParams, Issue, ErrorMessage>({
  async handler({org, name, id}: OnGetIssueParams) {
    try {
      return getIssue(org, name, Number(id));
    } catch (err) {
      throw (err as AxiosError<ErrorMessage>).response!.data;
    }
  },
});

const fxGetIssueComments = createEffect<Issue, Comment[], ErrorMessage>({
  handler: ({comments_url}: Issue) => {
    try {
      return getComments(comments_url);
    } catch (err) {
      throw (err as AxiosError<ErrorMessage>).response!.data;
    }
  },
});

export const $issue = createStore<Issue | null>(null)
  .on(onGetIssue.doneData, (_, payload) => payload)
  .reset(issueGate.close);

export const $comments = createStore<Comment[]>([])
  .on(fxGetIssueComments.doneData, (state, payload) => payload)
  .reset(issueGate.close);

const fxGetIssue = attach({
  effect: onGetIssue,
  mapParams: (params: IssueRouteParams, states) => ({...states, ...params}),
  source: $repository,
});

forward({
  from: issueGate.open,
  to: fxGetIssue,
});

forward({
  from: onGetIssue.doneData,
  to: fxGetIssueComments,
});

$error.on(onGetIssue.failData, (state, payload) => payload);
$error.on(fxGetIssueComments.failData, (state, payload) => payload);
