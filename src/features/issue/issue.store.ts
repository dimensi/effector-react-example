import {createGate} from 'effector-react';
import {attach, createEffect, createStore, forward, sample} from 'effector';
import {$repo, RepoMeta} from '../issues/issues.store';
import {getComments, getIssue, Issue, Comment, ErrorMessage} from '../../api';
import {AxiosError} from 'axios';

export interface IssueRouteParams {
  id: string
}

type OnGetIssueParams = RepoMeta & IssueRouteParams

export const issueGate = createGate<IssueRouteParams>('issue gate');

const onGetIssue = createEffect(async ({org, repo, id}: OnGetIssueParams) => {
  try {
    return getIssue(org, repo, Number(id));
  } catch (err) {
    throw (err as AxiosError<ErrorMessage>).response!.data;
  }
});

const fxGetIssue = attach({
  effect: onGetIssue,
  mapParams: ((params: IssueRouteParams, states) => ({...states, ...params})),
  source: $repo,
});

const fxGetIssueComments = createEffect(({comments_url}: Issue) => {
  return getComments(comments_url);
});

export const $issue = createStore<Issue | null>(null)
  .on(onGetIssue.doneData, (_, payload) => payload)
  .reset(issueGate.close);

export const $comments = createStore<Comment[]>([])
  .on(fxGetIssueComments.doneData, ((state, payload) => payload))
  .reset(issueGate.close);

export const $error = createStore<ErrorMessage | null>(null)
  .on(onGetIssue.failData, (state, payload) => {
    return payload as unknown as ErrorMessage;
  });

forward({
  from: issueGate.open,
  to: fxGetIssue,
});

forward({
  from: onGetIssue.doneData,
  to: fxGetIssueComments,
});