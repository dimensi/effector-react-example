import React, { FC } from "react";
import { useStore, useGate } from "effector-react";
import { submitForm, issuesGate, $meta, pageChanged } from "./issues.store";
import { IssuesList } from './issues-list'
import { useParams } from 'react-router-dom'
import { Pagination } from './pagination'

export const Issues: FC = () => {
  useGate(issuesGate, useParams());
  const { repo, page, lastPage } = useStore($meta);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <form onSubmit={submitForm}>
          <input
            type="text"
            name="org"
            placeholder="org"
            defaultValue={repo.org}
          />
          <input
            type="text"
            name="repo"
            placeholder="repo"
            defaultValue={repo.repo}
          />
          <button>change</button>
        </form>
      </div>
      <Pagination page={page} lastPage={lastPage} onChange={pageChanged}/>
      <IssuesList />
    </div>
  );
};
