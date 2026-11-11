interface AgentReturn {
  returnPercent: number | null;
}

export function getLeadingAgents<T extends AgentReturn>(agents: T[]): T[] {
  const maxReturnPercent = Math.max(
    ...agents.map((agent) => agent.returnPercent ?? 0),
  );

  return agents.filter(
    (agent) => (agent.returnPercent ?? 0) === maxReturnPercent,
  );
}
