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

const getIssueFx = createEffect<OnGetIssueParams, Issue, ErrorMessage>({
  async handler({org, name, id}: OnGetIssueParams) {
    try {
      return await getIssue(org, name, Number(id));
    } catch (err) {
      throw (err as AxiosError<ErrorMessage>).response!.data;
    }
  },
});

const getCommentsFx = createEffect<Issue, Comment[], ErrorMessage>({
  async handler({comments_url}: Issue) {
    try {
      return await getComments(comments_url);
    } catch (err) {
      throw (err as AxiosError<ErrorMessage>).response!.data;
    }
  },
});

export const $issue = createStore<Issue | null>(null)
  .on(getIssueFx.doneData, (_, payload) => payload)
  .reset(issueGate.close);

export const $comments = createStore<Comment[]>([])
  .on(getCommentsFx.doneData, (state, payload) => payload)
  .reset(issueGate.close);

const attachedGetIssue = attach({
  effect: getIssueFx,
  mapParams: (params: IssueRouteParams, states) => ({...states, ...params}),
  source: $repository,
});

forward({
  from: issueGate.open,
  to: attachedGetIssue,
});

forward({
  from: getIssueFx.doneData,
  to: getCommentsFx,
});

$error.on(getIssueFx.failData, (state, payload) => payload);
$error.on(getCommentsFx.failData, (state, payload) => payload);
