const ROUTES = [
  { pattern: /^\/$/, name: 'overview' },
  { pattern: /^\/overview$/, name: 'overview' },
  { pattern: /^\/sprints$/, name: 'sprints' },
  { pattern: /^\/sprint\/(\d+)$/, name: 'sprint', params: ['sprintId'] },
  { pattern: /^\/issue\/([^/]+)$/, name: 'issue', params: ['issueKey'] },
  { pattern: /^\/issues\/impact\/([^/]+)$/, name: 'issues-by-impact', params: ['impact'] },
  { pattern: /^\/issues\/status\/([^/]+)$/, name: 'issues-by-status', params: ['status'] },
  { pattern: /^\/evidence$/, name: 'evidence' },
  { pattern: /^\/evidence\/([^/]+)$/, name: 'evidence-item', params: ['file'] },
  { pattern: /^\/decisions$/, name: 'decisions' },
  { pattern: /^\/responses$/, name: 'responses' },
];

export function parseRoute() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const path = raw.split('?')[0];

  for (const route of ROUTES) {
    const match = path.match(route.pattern);
    if (!match) {
      continue;
    }
    const params = {};
    route.params?.forEach((key, index) => {
      params[key] = decodeURIComponent(match[index + 1]);
    });
    return { name: route.name, path, params };
  }

  return { name: 'overview', path: '/', params: {} };
}

export function navigate(path) {
  window.location.hash = path.startsWith('/') ? path : `/${path}`;
}

export function onRouteChange(callback) {
  window.addEventListener('hashchange', callback);
  callback();
}
