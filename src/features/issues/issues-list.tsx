import { useList } from "effector-react";

export function IssuesList() {
  return useList($issues);
}
