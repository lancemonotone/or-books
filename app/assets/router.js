const ROUTES = [
  { pattern: /^\/$/, name: 'overview' },
  { pattern: /^\/overview$/, name: 'overview' },
  { pattern: /^\/sprints$/, name: 'sprints' },
  { pattern: /^\/sprint\/(\d+)$/, name: 'sprint', params: ['sprintId'] },
  { pattern: /^\/task\/([^/]+)$/, name: 'task', params: ['taskKey'] },
  { pattern: /^\/tasks\/priority\/([^/]+)$/, name: 'tasks-by-priority', params: ['priority'] },
  { pattern: /^\/tasks\/status\/([^/]+)$/, name: 'tasks-by-status', params: ['status'] },
  { pattern: /^\/tasks\/tag\/([^/]+)$/, name: 'tasks-by-tag', params: ['tag'] },
  { pattern: /^\/evidence$/, name: 'evidence' },
  { pattern: /^\/evidence\/([^/]+)$/, name: 'evidence-item', params: ['file'] },
  { pattern: /^\/estimates$/, name: 'estimates' },
  { pattern: /^\/responses$/, name: 'responses' },
  { pattern: /^\/settings$/, name: 'settings' },
];

export function parseRoute() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const queryIndex = raw.indexOf('?');
  const path = queryIndex >= 0 ? raw.slice(0, queryIndex) : raw;
  const query = queryIndex >= 0 ? raw.slice(queryIndex + 1) : '';
  const searchParams = new URLSearchParams(query);

  for (const route of ROUTES) {
    const match = path.match(route.pattern);
    if (!match) {
      continue;
    }
    const params = {};
    route.params?.forEach((key, index) => {
      params[key] = decodeURIComponent(match[index + 1]);
    });
    return { name: route.name, path, params, searchParams };
  }

  return { name: 'overview', path: '/', params: {}, searchParams };
}

export function navigate(path) {
  window.location.hash = path.startsWith('/') ? path : `/${path}`;
}

export function onRouteChange(callback) {
  window.addEventListener('hashchange', callback);
  callback();
}
