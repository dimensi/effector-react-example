import {FormEvent} from 'react';
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
import {getIssues, Issue} from '../../api';

const defaultRepo = {
  org: "facebook",
  repo: "react"
};

export type RepoMeta = typeof defaultRepo;

export const $repo = createStore(defaultRepo);

const updateRepo = createEvent<RepoMeta>();

export const submitForm = updateRepo.prepend<FormEvent<HTMLFormElement>>(
  (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const org = form.elements.namedItem("org") as HTMLInputElement;
    const repo = form.elements.namedItem("repo") as HTMLInputElement;
    return {
      org: org.value,
      repo: repo.value
    };
  }
);

$repo.on(updateRepo, (_, data) => data);

export const issuesGate = createGate("Issues Gate");

const fxOnIssues = createEffect({
  handler({ repo: { repo, org }, page }: { repo: RepoMeta; page: number }) {
    return getIssues(org, repo);
  }
});

const page = createStore(0);
export const $issues = createStore<Issue[]>([]).on(
  fxOnIssues.doneData,
  (_, data) => data.issues
);

export const $meta = combine({ page, repo: $repo });

const fxGetIssues = attach({
  source: combine({ repo: $repo, page }),
  effect: fxOnIssues
});

guard({
  filter: $issues.map((items) => !items.length),
  source: issuesGate.open,
  target: fxGetIssues
});

forward({
  from: $repo.updates,
  to: fxGetIssues
});
