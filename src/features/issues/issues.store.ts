import {FormEvent} from 'react';
import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
} from 'effector';
import {createGate} from 'effector-react';
import {ErrorMessage, getIssues, Issue} from '../../api';
import {defaultRepo} from '../../config';
import {routerHistory} from '../../history';
import {AxiosError} from 'axios';
import {$error} from '../errors.store';

export type RepoMeta = typeof defaultRepo;
export type IssuesRouteParams = {repo: string; org: string};

export const $repo = createStore<RepoMeta>({repo: '', org: ''});

const updateRepo = createEvent<RepoMeta>();

export const submitForm = updateRepo.prepend<FormEvent<HTMLFormElement>>(
  (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const org = form.elements.namedItem('org') as HTMLInputElement;
    const repo = form.elements.namedItem('repo') as HTMLInputElement;
    return {
      org: org.value,
      repo: repo.value,
    };
  },
);

$repo.on(updateRepo, (_, data) => data);

export const issuesGate = createGate<IssuesRouteParams>('Issues Gate');

const fxOnIssues = createEffect(
  async ({repo: {repo, org}, page}: {repo: RepoMeta; page: number}) => {
    console.count('called')
    try {
      return await getIssues(org, repo);
    } catch (err) {
      throw (err as AxiosError<ErrorMessage>).response!.data;
    }
  },
);

const page = createStore(0);
export const $issues = createStore<Issue[]>([]).on(
  fxOnIssues.doneData,
  (_, data) => data.issues,
);

export const $meta = combine({page, repo: $repo});

const fxGetIssues = attach({
  source: combine({repo: $repo, page}),
  effect: fxOnIssues,
});

forward({
  from: issuesGate.open,
  to: updateRepo.prepend((params) => ({
    repo: params.repo,
    org: params.org,
  })),
});

forward({
  from: $repo.updates,
  to: fxGetIssues,
});

$repo.updates.watch((state) => {
  if (
    !routerHistory.location.pathname.includes(`/${state.org}/${state.repo}`)
  ) {
    routerHistory.push(`/${state.org}/${state.repo}/`);
  }
});

$error.on(fxOnIssues.failData, (state, payload) => {
  return (payload as unknown) as ErrorMessage;
});
