import React, {FC, FormEvent, useCallback} from 'react';
import {useGate, useStore} from 'effector-react';
import {$meta, issuesGate} from './issues.store';
import {IssuesList} from './issues-list';
import {useHistory} from 'react-router-dom';
import {Pagination} from './pagination';
import {$repository} from '../repository.store';

export const Issues: FC = () => {
  useGate(issuesGate)
  const routerHistory = useHistory()
  const { page, lastPage } = useStore($meta);
  const repository = useStore($repository)

  const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const { value: org } = form.elements.namedItem('org') as HTMLInputElement;
    const { value: repo } = form.elements.namedItem('repo') as HTMLInputElement;

    if (![org, repo].every(Boolean)) return

    routerHistory.push(`/${org}/${repo}/`)
  }, [routerHistory])

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="org"
            placeholder="org"
            defaultValue={repository.org}
          />
          <input
            type="text"
            name="repo"
            placeholder="repo"
            defaultValue={repository.name}
          />
          <button>change</button>
        </form>
      </div>
      <Pagination page={page} lastPage={lastPage} />
      <IssuesList />
    </div>
  );
};
