import { useList } from "effector-react";
import React from "react";
import { Issue } from "../../api";
import {$issues, IssuesRouteParams} from './issues.store';
import { Link, useParams } from "react-router-dom";


export function IssuesList() {
  return useList($issues, (issue) => (
    <IssueItem issue={issue} key={issue.id} />
  ));
}

function IssueItem({ issue: { number, title, user, labels } }: { issue: Issue }) {
  const params = useParams<IssuesRouteParams>()
  return (
    <article style={{ marginBottom: 24 }}>
      <header style={{ display: "flex", alignItems: "center" }}>
        <Link to={`/${params.org}/${params.repo}/issues/${number}`}>
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
