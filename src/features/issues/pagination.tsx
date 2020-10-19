import React from 'react';
import { Link } from 'react-router-dom';

export function Pagination({
  page,
  lastPage,
}: {
  page: number;
  lastPage: number;
}) {
  if (lastPage === 1) return null;

  return (
    <ul>
      {Array.from({length: lastPage}, (_, idx) => {
        const itemPage = idx + 1;
        return (
          <li
            key={itemPage}
            style={{
              display: 'inline-block',
              margin: 4,
              width: 20,
              height: 20,
              background: page === itemPage ? 'transparent' : 'grey',
              textAlign: 'center',
              lineHeight: '20px',
              cursor: 'pointer'
            }}>
            <Link to={location => ({...location, search: `page=${itemPage}`})}>
              {itemPage}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
