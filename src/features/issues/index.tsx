import React, { FC } from "react";
import { useStore, useGate } from "effector-react";
import { submitForm, issuesGate, $meta } from "./issues.store";
import { IssuesList } from './issues-list'

export const Issues: FC = () => {
  useGate(issuesGate);
  const { repo } = useStore($meta);

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
      <IssuesList />
    </div>
  );
};
