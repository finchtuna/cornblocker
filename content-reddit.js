// CornBlocker — Reddit NSFW detection (Layer 2)
// Detects NSFW subreddits via JSON API + DOM indicators
// Redirects to blocked.html when NSFW content is detected

(() => {
  let lastCheckedUrl = '';
  let checking = false;

  const BLOCKED_PAGE = chrome.runtime.getURL('blocked.html');

  function redirect() {
    window.location.href = BLOCKED_PAGE;
  }

  // Extract subreddit name from URL path
  function getSubreddit(path) {
    const match = path.match(/^\/r\/([^/]+)/i);
    return match ? match[1] : null;
  }

  // Detection method 1: Fetch subreddit about.json to check over18 flag
  async function checkSubredditAPI(subreddit) {
    try {
      const res = await fetch(`/r/${subreddit}/about.json`, {
        credentials: 'same-origin'
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data?.data?.over18 === true;
    } catch {
      return false;
    }
  }

  // Detection method 2: DOM-based NSFW indicators
  function checkDOMIndicators() {
    // New Reddit: content gate / NSFW interstitial
    if (document.querySelector('[data-testid="content-gate"]')) return true;
    if (document.querySelector('shreddit-content-gate')) return true;

    // New Reddit: NSFW badge in subreddit header
    const nsfwBadges = document.querySelectorAll('[class*="nsfw"], [data-testid*="nsfw"]');
    for (const badge of nsfwBadges) {
      if (badge.textContent.toLowerCase().includes('nsfw')) return true;
    }

    // Old Reddit: body.over18 class
    if (document.body.classList.contains('over18')) return true;

    // Old Reddit: over18 interstitial page
    if (document.querySelector('.over18-notice, .interstitial-subreddit')) return true;

    return false;
  }

  async function checkCurrentPage() {
    const url = window.location.href;
    if (url === lastCheckedUrl || checking) return;
    lastCheckedUrl = url;
    checking = true;

    try {
      // Check enabled state
      const result = await chrome.storage.local.get('enabled');
      if (result.enabled === false) return;

      // DOM check first — fast, no network
      if (checkDOMIndicators()) {
        redirect();
        return;
      }

      // API check for subreddit pages
      const subreddit = getSubreddit(window.location.pathname);
      if (subreddit) {
        const isNSFW = await checkSubredditAPI(subreddit);
        if (isNSFW) {
          redirect();
          return;
        }
      }
    } finally {
      checking = false;
    }
  }

  // Watch for SPA navigation (Reddit doesn't do full page loads)
  let lastUrl = window.location.href;

  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      lastCheckedUrl = '';
      checkCurrentPage();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Also catch popstate and pushstate navigation
  window.addEventListener('popstate', () => {
    lastCheckedUrl = '';
    checkCurrentPage();
  });

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    lastCheckedUrl = '';
    checkCurrentPage();
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    lastCheckedUrl = '';
    checkCurrentPage();
  };

  // Initial check
  checkCurrentPage();
})();
