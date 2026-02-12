// CornBlocker — blocked page logic

const MESSAGES = {
  humor: [
    'Your future self just mass-texted your brain cells a thank you.',
    'Plot twist: the real dopamine was the self-control you built along the way.',
    'Congratulations, you just unlocked the "not today" achievement.',
    'Your browser history just breathed a sigh of relief.',
    'Somewhere, a therapist is nodding approvingly at this redirect.',
    'This corn is the only kind of "adult content" you need right now.',
    'You just dodged a bullet. A very specific, very pixelated bullet.',
    'Breaking news: local person makes excellent life decision.',
    'Your WiFi router is proud of you for the first time ever.',
    'The corn gods have spoken, and they said "nah."'
  ],
  identity: [
    'You\'re not fighting something. You\'re becoming someone.',
    'Every time you land here, you\'re proving who\'s in charge.',
    'This is what choosing yourself looks like.',
    'The person you want to be? They make this exact choice.',
    'You\'re not missing out. You\'re opting in to something better.',
    'This redirect is you keeping a promise to yourself.',
    'Identity shift in progress. Please hold.',
    'The version of you that installed this? They\'re cheering right now.',
    'You\'re building a pattern of self-respect, one block at a time.',
    'This is discipline. And discipline is just self-love with a backbone.'
  ],
  science: [
    'Your prefrontal cortex just overrode your limbic system. That\'s literally evolution.',
    'Dopamine receptors are upregulating as we speak. Your brain is healing.',
    'Urges peak and pass in about 15 minutes. You\'re already through the worst.',
    'Each time you resist, you strengthen the neural pathway for self-control.',
    'Your brain is rewiring right now. Neuroplasticity is on your side.',
    'The craving you feel is just a chemical echo. It\'s not a command.',
    'Porn hijacks the same reward circuits as slot machines. You just walked away from the table.',
    'Your baseline dopamine sensitivity improves every day you choose differently.',
    'The amygdala wants what it wants. But you have a whole frontal lobe to outvote it.',
    'Habit loops need a cue, routine, and reward. You just broke the routine.'
  ],
  action: [
    'Go drink a glass of water. Hydration is underrated.',
    'Do 20 pushups. Trade one kind of rush for another.',
    'Text someone you haven\'t talked to in a while.',
    'Step outside for 5 minutes. The sky is still up there.',
    'Open that project you\'ve been putting off. Start with one line.',
    'Put on a song that makes you feel something real.',
    'Write down three things that went well today.',
    'Clean one surface in your room. Outer order, inner calm.',
    'Read one page of that book you started. Just one.',
    'Cook something. Even toast counts. Especially toast.'
  ],
  perspective: [
    'A year from now, you\'ll be glad you started stopping today.',
    'Freedom isn\'t doing whatever you want. It\'s not being controlled by what you want.',
    'The discomfort you feel right now? That\'s growth. It\'s supposed to feel like this.',
    'You don\'t have to be perfect. You just have to keep choosing.',
    'Relapse isn\'t failure. It\'s data. But you didn\'t relapse this time.',
    'Most people never even try to change. You installed a Chrome extension.',
    'Small wins compound. This one counts.',
    'You\'re not depriving yourself. You\'re investing in yourself.',
    'The urge is temporary. The regret would have lasted longer.',
    'You\'re reading this instead. That\'s already a different choice.'
  ]
};

const CATEGORIES = Object.keys(MESSAGES);
let lastIndex = -1;
let lastCategory = '';

const messageEl = document.getElementById('message');
const categoryTagEl = document.getElementById('categoryTag');
const newMessageBtn = document.getElementById('newMessageBtn');
const cornBg = document.getElementById('cornBg');

function getRandomMessage() {
  // Pick a random category, then a random message — avoid repeating the same one
  let category, index;
  do {
    category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    index = Math.floor(Math.random() * MESSAGES[category].length);
  } while (category === lastCategory && index === lastIndex);

  lastCategory = category;
  lastIndex = index;

  return { text: MESSAGES[category][index], category };
}

function showMessage(animate) {
  const { text, category } = getRandomMessage();

  if (animate) {
    messageEl.classList.add('fade-out');
    setTimeout(() => {
      messageEl.textContent = text;
      categoryTagEl.textContent = category;
      messageEl.classList.remove('fade-out');
    }, 300);
  } else {
    messageEl.textContent = text;
    categoryTagEl.textContent = category;
  }
}

function createFloatingCorn() {
  const count = 15;
  for (let i = 0; i < count; i++) {
    const corn = document.createElement('div');
    corn.className = 'corn-float';
    corn.textContent = '\u{1F33D}';
    corn.style.left = Math.random() * 100 + '%';
    corn.style.animationDuration = 12 + Math.random() * 18 + 's';
    corn.style.animationDelay = -(Math.random() * 30) + 's';
    corn.style.fontSize = 1 + Math.random() * 1.5 + 'rem';
    cornBg.appendChild(corn);
  }
}

// Urge timer — rises quickly to ~80%, then slowly declines
function startUrgeTimer() {
  const bar = document.getElementById('urgeBar');
  const percent = document.getElementById('urgePercent');
  const startTime = Date.now();

  // Phase 1: rise to 80% over 5 seconds (ease-out)
  // Phase 2: decline from 80% to 0% over 35 seconds (ease-in)
  const RISE_DURATION = 5000;
  const PEAK = 80;
  const DECLINE_DURATION = 35000;

  function update() {
    const elapsed = Date.now() - startTime;
    let value;

    if (elapsed < RISE_DURATION) {
      // Rise phase — ease-out curve
      const t = elapsed / RISE_DURATION;
      value = PEAK * (1 - Math.pow(1 - t, 3));
    } else {
      // Decline phase — ease-in curve
      const t = Math.min((elapsed - RISE_DURATION) / DECLINE_DURATION, 1);
      value = PEAK * Math.pow(1 - t, 2);
    }

    value = Math.max(0, Math.round(value));
    bar.style.width = value + '%';
    percent.textContent = value + '%';

    if (value > 0) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Stats — increment on every blocked page load
async function incrementStats() {
  const today = new Date().toDateString();
  const result = await chrome.storage.local.get('cornblocker_stats');
  const stats = result.cornblocker_stats || { date: today, count: 0, total: 0 };

  // Reset daily count if it's a new day
  if (stats.date !== today) {
    stats.date = today;
    stats.count = 0;
  }

  stats.count++;
  stats.total++;

  await chrome.storage.local.set({ cornblocker_stats: stats });
  updateStatsDisplay(stats);
}

function updateStatsDisplay(stats) {
  document.getElementById('statToday').textContent = stats.count;
  document.getElementById('statTotal').textContent = stats.total;
}

// Init
showMessage(false);
createFloatingCorn();
startUrgeTimer();
incrementStats();
newMessageBtn.addEventListener('click', () => showMessage(true));
