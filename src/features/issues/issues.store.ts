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
import {ErrorMessage, getIssues, Issue, IssuesResult} from '../../api';
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

const fxOnIssues = createEffect<{repo: RepoMeta; page: number}, IssuesResult, ErrorMessage> ({
  async handler ({repo: {repo, org}, page}) {
    try {
      return await getIssues(org, repo, page);
    } catch (err) {
      throw (err as AxiosError<ErrorMessage>).response!.data;
    }
  }
});

export const pageChanged = createEvent<number>();

const page = createStore(1).reset(updateRepo);
const lastPage = createStore(1);

page.on(pageChanged, (_, newPage) => newPage)

export const $issues = createStore<Issue[]>([]).on(
  fxOnIssues.doneData,
  (_, data) => data.issues,
);

lastPage.on(fxOnIssues.doneData, (_, payload) => payload.pageCount)

export const $meta = combine({page, lastPage, repo: $repo});

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
  from: $meta.updates,
  to: fxGetIssues,
});

$repo.updates.watch(({ org, repo }) => {
  const repoURL = [org, repo].join('/')
  if (
    !routerHistory.location.pathname.includes(`/${repoURL}`)
  ) {
    routerHistory.push(`/${repoURL}/`);
  }
});

page.updates.watch((newPage) => {
  routerHistory.push({
    ...routerHistory.location,
    search: newPage > 1 ? `page=${newPage}` : '',
  })
})

$error.on(fxOnIssues.failData, (state, payload) => payload);
