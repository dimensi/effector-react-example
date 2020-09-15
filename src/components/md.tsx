import React from "react";
import { FC, useMemo } from "react";
// @ts-ignore
import { Remarkable } from 'remarkable'

const mdParser = new Remarkable()

export const Md: FC<{ md: string }> = ({ md }) => {
  const result = useMemo(() => mdParser.render(md, {}), [md])

  return <div dangerouslySetInnerHTML={{ __html: result }} />
}