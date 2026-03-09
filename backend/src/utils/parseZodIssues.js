export function parseZodIssues(issues) {
  return issues.map(issue => {
    const path = issue.path.join('.');
    return `${path}: ${issue.message}`;
  }).join('; ');
}