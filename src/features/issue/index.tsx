import {useGate, useList, useStore} from "effector-react";
import React from "react";
import {$comments, $error, $issue, issueGate} from './issue.store';
import {useParams, Link} from "react-router-dom";
import {Md} from "../../components/md";

export function Issue() {
    useGate(issueGate, useParams())

    const issue = useStore($issue)
    const error = useStore($error)

    if (!issue) {
        return <div>loading</div>
    }

    if (error) {
        return  <div>{error.message}</div>
    }

    return <main>
        <Link to='/'>back to</Link>
        <header>
            <h1>{issue.title}</h1>
            <p>written by {issue.user.login}</p>
        </header>
        <hr/>
        <Md md={issue.body}/>
        <hr/>
        <h2>comments:</h2>
        <CommentsList />
    </main>
}

export function CommentsList() {
    return useList($comments, (item) => {
        return (
            <div key={item.id}>
                <strong>{item.user.login}</strong>
                <time dateTime={item.created_at}>{item.created_at}</time>
                <Md md={item.body}/>
            </div>
        )
    })
}