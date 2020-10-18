import React from 'react';

export function Pagination({
  page,
  lastPage,
  onChange,
}: {
  page: number;
  lastPage: number;
  onChange: (page: number) => void;
}) {
  if (lastPage === 1) return null;

  return (
    <ul>
      {Array.from({length: lastPage}, (_, idx) => {
        const itemPage = idx + 1;
        const url = new URL(window.location.toString())
        url.searchParams.set('page', itemPage.toString())
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
            <a
              href={url.toString()}
              onClick={(event) => {
                event.preventDefault();
                onChange(itemPage);
              }}>
              {itemPage}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
