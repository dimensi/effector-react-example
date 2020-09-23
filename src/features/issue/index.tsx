import {useGate, useStore} from 'effector-react';
import React from 'react';
import {$comments, $issue, issueGate} from './issue.store';
import {Link, useParams} from 'react-router-dom';
import {Md} from '../../components/md';

export function Issue() {
  useGate(issueGate, useParams());

  const issue = useStore($issue);

  if (!issue) {
    return <div>loading</div>;
  }

  return <main>
    <Link to='../'>back to</Link>
    <header>
      <h1>{issue.title}</h1>
      <p>written by {issue.user.login}</p>
    </header>
    <hr />
    <Md md={issue.body} />
    <hr />
    <CommentsList />
  </main>;
}

export function CommentsList() {
  const comments = useStore($comments);
  if (!comments.length) return null
  return (
    <div>
      <h2>comments:</h2>
      {comments.map((item) => (
        <div key={item.id}>
          <strong>{item.user.login}</strong>
          <time dateTime={item.created_at}>{item.created_at}</time>
          <Md md={item.body} />
        </div>
      ))}
    </div>
  );
}