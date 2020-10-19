import React from 'react';
import {Issue} from '../../api';
import {Link} from 'react-router-dom';
import {TRepo} from '../repository.store';

export function IssuesList({
  repository,
  issues,
}: {
  repository: TRepo;
  issues: Issue[];
}) {
  return (
    <>
      {issues.map((issue) => (
        <IssueItem issue={issue} key={issue.id} repository={repository} />
      ))}
    </>
  );
}

interface IssueItemProps {
  issue: Issue;
  repository: TRepo;
}

function IssueItem({
  issue: {number, title, user, labels},
  repository,
}: IssueItemProps) {
  return (
    <article style={{marginBottom: 24}}>
      <header style={{display: 'flex', alignItems: 'center'}}>
        <Link to={`/${repository.org}/${repository.name}/issues/${number}`}>
          <strong>
            #{number}: {title}
          </strong>
        </Link>
        <figure>
          <img src={user.avatar_url} width={40} />
          <figcaption>by {user.login}</figcaption>
        </figure>
      </header>
      <div>
        {labels.map((label) => (
          <span key={label.id}>{label.name}</span>
        ))}
      </div>
    </article>
  );
}
