// CornBlocker — Twitter/X sensitive content filter (Layer 3)
// Hides sensitive media tweets inline, redirects on sensitive profile gates

(() => {
  const BLOCKED_PAGE = chrome.runtime.getURL('blocked.html');
  const NOTICE_CLASS = 'cornblocker-notice';

  // Cache enabled state
  let enabled = true;
  const enabledReady = chrome.storage.local.get('enabled').then((r) => {
    enabled = r.enabled !== false;
  });
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) enabled = changes.enabled.newValue !== false;
  });

  // Replace sensitive tweet content with inline notice
  function hideSensitiveTweet(tweet) {
    if (tweet.querySelector('.' + NOTICE_CLASS)) return;

    // Find the sensitive content warning area
    const sensitiveWarning = tweet.querySelector(
      '[data-testid="sensitiveMediaWarning"], ' +
      '[data-testid="tweet-sensitive-media-warning"]'
    );
    if (!sensitiveWarning) return;

    // Create inline notice
    const notice = document.createElement('div');
    notice.className = NOTICE_CLASS;
    notice.style.cssText = [
      'padding: 1rem',
      'background: rgba(245, 197, 66, 0.08)',
      'border: 1px solid rgba(245, 197, 66, 0.25)',
      'border-radius: 12px',
      'color: #f5c542',
      'font-size: 14px',
      'text-align: center',
      'margin: 8px 0'
    ].join(';');
    notice.textContent = '\u{1F33D} Sensitive content blocked by CornBlocker';

    // Replace the sensitive media container
    const mediaContainer = sensitiveWarning.closest(
      '[data-testid="tweetPhoto"], ' +
      '[data-testid="videoPlayer"], ' +
      '[data-testid="card.wrapper"]'
    ) || sensitiveWarning.parentElement;

    if (mediaContainer) {
      mediaContainer.replaceWith(notice);
    } else {
      sensitiveWarning.replaceWith(notice);
    }
  }

  // Check for sensitive profile interstitial
  function checkProfileGate() {
    const interstitials = document.querySelectorAll(
      '[data-testid="interstitial-container"], ' +
      '[data-testid="sensitiveMediaInterstitial"]'
    );

    for (const el of interstitials) {
      const text = (el.textContent || '').toLowerCase();
      if (text.includes('sensitive') || text.includes('adult')) {
        window.location.replace(BLOCKED_PAGE);
        return true;
      }
    }
    return false;
  }

  // Scan all tweets for sensitive content warnings
  function scanTweets() {
    const tweets = document.querySelectorAll('[data-testid="tweet"]');
    tweets.forEach(hideSensitiveTweet);
  }

  async function check() {
    await enabledReady;
    if (!enabled) return;
    if (checkProfileGate()) return;
    scanTweets();
  }

  // Throttled + trailing checks avoid jank while guaranteeing periodic enforcement.
  let trailingTimer;
  let inFlight = false;
  let pendingAfterRun = false;
  let lastRun = 0;
  const CHECK_INTERVAL_MS = 200;

  function runCheck() {
    if (inFlight) {
      pendingAfterRun = true;
      return;
    }
    inFlight = true;
    lastRun = Date.now();
    Promise.resolve(check()).finally(() => {
      inFlight = false;
      if (pendingAfterRun) {
        pendingAfterRun = false;
        scheduleCheck();
      }
    });
  }

  function scheduleCheck() {
    const sinceLastRun = Date.now() - lastRun;
    if (sinceLastRun >= CHECK_INTERVAL_MS) {
      runCheck();
      return;
    }

    if (!trailingTimer) {
      trailingTimer = setTimeout(() => {
        trailingTimer = null;
        runCheck();
      }, CHECK_INTERVAL_MS - sinceLastRun);
    }
  }

  const observer = new MutationObserver(() => {
    scheduleCheck();
  });

  // Start observing once body is available
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleCheck();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
      scheduleCheck();
    });
  }
})();
