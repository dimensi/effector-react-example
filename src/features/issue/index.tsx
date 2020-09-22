import { useGate } from "effector-react";
import React from "react";

export function Issue() {
  useGate(issueGate)
  return <div>hi</div>
}