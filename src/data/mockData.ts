export interface League {
  id: string; name: string; country: string; code: string;
}

export interface Team {
  id: string; name: string; shortName: string; league: string;
}

export interface Fixture {
  id: string; homeTeam: Team; awayTeam: Team; league: League;
  kickoff: string; status: 'upcoming' | 'live' | 'finished';
  score?: { home: number; away: number };
  day: 'today' | 'tomorrow' | 'weekend';
}

export interface Pick {
  id: string; fixtureId: string; fixture: Fixture;
  market: string; pick: string; confidence: number;
  risk: 'low' | 'medium' | 'high';
  minOdds: number; stakeUnits: number;
  action: 'bet_now' | 'wait' | 'no_bet';
  category: 'safe' | 'value' | 'avoid';
  whyThisPick: string;
  saferAlternative?: string;
  noBetConditions: string[];
  createdAt: string;
}

export interface BetLog {
  id: string; date: string; match: string; market: string;
  odds: number; stakeUnits: number; result: 'pending' | 'won' | 'lost' | 'void';
  payout: number; notes: string;
}

export interface LeaderboardEntry {
  rank: number; username: string; roi: number; betCount: number;
  maxDrawdown: number; winRate: number; disciplineScore: number;
  avgUnitVariance: number; exposureControlScore: number;
  profitStreakDays: number; disciplineStreakDays: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Elite';
}

export interface NewsItem {
  id: string; title: string; content: string; league: string;
  team: string; type: 'injury' | 'suspension' | 'transfer' | 'form';
  date: string;
}

export interface BlogPost {
  slug: string; title: string; excerpt: string; content: string;
  author: string; date: string; readTime: string; category: string;
}

export const leagues: League[] = [
  { id: 'epl', name: 'Premier League', country: 'England', code: 'EPL' },
  { id: 'ucl', name: 'Champions League', country: 'Europe', code: 'UCL' },
  { id: 'laliga', name: 'La Liga', country: 'Spain', code: 'LAL' },
  { id: 'seriea', name: 'Serie A', country: 'Italy', code: 'SER' },
  { id: 'npfl', name: 'NPFL', country: 'Nigeria', code: 'NPFL' },
  { id: 'caf', name: 'CAF Champions League', country: 'Africa', code: 'CAF' },
  { id: 'intl', name: 'International', country: 'World', code: 'INTL' },
];

const teamsByLeague: Record<string, { name: string; short: string }[]> = {
  epl: [
    { name: 'Arsenal', short: 'ARS' }, { name: 'Manchester City', short: 'MCI' },
    { name: 'Liverpool', short: 'LIV' }, { name: 'Chelsea', short: 'CHE' },
    { name: 'Manchester United', short: 'MUN' }, { name: 'Tottenham', short: 'TOT' },
    { name: 'Newcastle United', short: 'NEW' }, { name: 'Aston Villa', short: 'AVL' },
    { name: 'Brighton', short: 'BHA' }, { name: 'West Ham', short: 'WHU' },
  ],
  ucl: [
    { name: 'Real Madrid', short: 'RMA' }, { name: 'Bayern Munich', short: 'BAY' },
    { name: 'Barcelona', short: 'BAR' }, { name: 'PSG', short: 'PSG' },
    { name: 'Inter Milan', short: 'INT' }, { name: 'Borussia Dortmund', short: 'BVB' },
  ],
  laliga: [
    { name: 'Real Madrid', short: 'RMA' }, { name: 'Barcelona', short: 'BAR' },
    { name: 'Atletico Madrid', short: 'ATM' }, { name: 'Real Sociedad', short: 'RSO' },
    { name: 'Villarreal', short: 'VIL' }, { name: 'Athletic Bilbao', short: 'ATH' },
  ],
  seriea: [
    { name: 'Inter Milan', short: 'INT' }, { name: 'AC Milan', short: 'ACM' },
    { name: 'Juventus', short: 'JUV' }, { name: 'Napoli', short: 'NAP' },
    { name: 'Roma', short: 'ROM' }, { name: 'Lazio', short: 'LAZ' },
  ],
  npfl: [
    { name: 'Enyimba FC', short: 'ENY' }, { name: 'Rangers Int\'l', short: 'RAN' },
    { name: 'Kano Pillars', short: 'KAN' }, { name: 'Akwa United', short: 'AKW' },
  ],
  caf: [
    { name: 'Al Ahly', short: 'AHL' }, { name: 'Wydad AC', short: 'WAC' },
    { name: 'Esperance', short: 'ESP' }, { name: 'Mamelodi Sundowns', short: 'SUN' },
  ],
  intl: [
    { name: 'Brazil', short: 'BRA' }, { name: 'Argentina', short: 'ARG' },
    { name: 'France', short: 'FRA' }, { name: 'Germany', short: 'GER' },
    { name: 'Nigeria', short: 'NGA' }, { name: 'England', short: 'ENG' },
  ],
};

function makeTeam(leagueId: string, idx: number): Team {
  const t = teamsByLeague[leagueId]?.[idx] || { name: `Team ${idx}`, short: `T${idx}` };
  return { id: `${leagueId}-${t.short.toLowerCase()}`, name: t.name, shortName: t.short, league: leagueId };
}

function makeFixture(id: number, day: 'today' | 'tomorrow' | 'weekend', leagueId: string, homeIdx: number, awayIdx: number, status: 'upcoming' | 'live' | 'finished' = 'upcoming'): Fixture {
  const league = leagues.find(l => l.id === leagueId)!;
  const now = new Date();
  const offset = day === 'today' ? 0 : day === 'tomorrow' ? 1 : 3;
  const ko = new Date(now); ko.setDate(ko.getDate() + offset); ko.setHours(12 + (id % 10), (id * 17) % 60);
  return {
    id: `fix-${id}`,
    homeTeam: makeTeam(leagueId, homeIdx),
    awayTeam: makeTeam(leagueId, awayIdx),
    league,
    kickoff: ko.toISOString(),
    status,
    score: status === 'finished' ? { home: id % 4, away: (id * 3) % 3 } : undefined,
    day,
  };
}

export const fixtures: Fixture[] = [
  // Today - 20 fixtures
  ...([
    [1, 'epl', 0, 1], [2, 'epl', 2, 3], [3, 'epl', 4, 5], [4, 'epl', 6, 7],
    [5, 'laliga', 0, 1], [6, 'laliga', 2, 3], [7, 'laliga', 4, 5],
    [8, 'seriea', 0, 1], [9, 'seriea', 2, 3], [10, 'seriea', 4, 5],
    [11, 'ucl', 0, 1], [12, 'ucl', 2, 3], [13, 'ucl', 4, 5],
    [14, 'npfl', 0, 1], [15, 'npfl', 2, 3],
    [16, 'caf', 0, 1], [17, 'caf', 2, 3],
    [18, 'intl', 0, 1], [19, 'intl', 2, 3], [20, 'intl', 4, 5],
  ] as [number, string, number, number][]).map(([id, lg, h, a]) =>
    makeFixture(id, 'today', lg, h, a, id <= 3 ? 'finished' : 'upcoming')
  ),
  // Tomorrow - 20 fixtures
  ...([
    [21, 'epl', 1, 4], [22, 'epl', 3, 6], [23, 'epl', 5, 8],
    [24, 'laliga', 1, 4], [25, 'laliga', 0, 5],
    [26, 'seriea', 1, 4], [27, 'seriea', 0, 5],
    [28, 'ucl', 1, 4], [29, 'ucl', 0, 5],
    [30, 'npfl', 0, 3], [31, 'npfl', 1, 2],
    [32, 'caf', 1, 2], [33, 'caf', 0, 3],
    [34, 'intl', 1, 4], [35, 'intl', 0, 5],
    [36, 'epl', 0, 9], [37, 'laliga', 2, 5], [38, 'seriea', 3, 5],
    [39, 'ucl', 2, 4], [40, 'caf', 2, 3],
  ] as [number, string, number, number][]).map(([id, lg, h, a]) =>
    makeFixture(id, 'tomorrow', lg, h, a)
  ),
  // Weekend - 22 fixtures
  ...([
    [41, 'epl', 0, 3], [42, 'epl', 1, 5], [43, 'epl', 2, 7], [44, 'epl', 4, 9],
    [45, 'laliga', 0, 3], [46, 'laliga', 1, 5], [47, 'laliga', 2, 4],
    [48, 'seriea', 0, 3], [49, 'seriea', 1, 5], [50, 'seriea', 2, 4],
    [51, 'ucl', 0, 3], [52, 'ucl', 1, 5],
    [53, 'npfl', 0, 2], [54, 'npfl', 1, 3],
    [55, 'caf', 0, 2], [56, 'caf', 1, 3],
    [57, 'intl', 0, 3], [58, 'intl', 1, 4], [59, 'intl', 2, 5],
    [60, 'epl', 6, 8], [61, 'laliga', 3, 5], [62, 'seriea', 4, 5],
  ] as [number, string, number, number][]).map(([id, lg, h, a]) =>
    makeFixture(id, 'weekend', lg, h, a)
  ),
];

const markets = ['1X2', 'Double Chance', 'DNB', 'BTTS', 'Over/Under 2.5', 'Over/Under 1.5', 'Asian Handicap'];
const pickSentences = [
  "Strong home form with 5 wins in last 6. Defensive stats favor the home side.",
  "Away team unbeaten in 8 with league-best xG. Value in the draw-no-bet market.",
  "Both teams scoring in 70%+ of recent matches. BTTS is well-supported by the data.",
  "Under 2.5 goals in 4 of the last 5 H2H meetings. Tactical game expected.",
  "Home team dominant on set pieces, away team vulnerable aerially. Over 1.5 favored.",
  "Recent lineup changes suggest instability. Avoid or wait for team news confirmation.",
  "High-variance fixture — both teams press aggressively. Goals expected but unpredictable.",
  "Away side has won 3 of last 4 against similar-ranked opponents. Value in away win.",
];

const noBetConds = [
  "Key striker ruled out on matchday",
  "Heavy rain forecast affecting pitch",
  "Odds drop below min threshold",
  "Late lineup changes expected",
  "Manager rotation for midweek fixture",
];

function makePick(idx: number, fixture: Fixture, category: 'safe' | 'value' | 'avoid'): Pick {
  const market = markets[idx % markets.length];
  const conf = category === 'safe' ? 70 + (idx % 20) : category === 'value' ? 55 + (idx % 25) : 40 + (idx % 20);
  const risk: 'low' | 'medium' | 'high' = category === 'safe' ? 'low' : category === 'value' ? 'medium' : 'high';
  const action: 'bet_now' | 'wait' | 'no_bet' = category === 'avoid' ? 'no_bet' : idx % 3 === 0 ? 'wait' : 'bet_now';
  const odds = +(1.3 + (idx % 22) * 0.1).toFixed(2);
  return {
    id: `pick-${idx}`,
    fixtureId: fixture.id,
    fixture,
    market,
    pick: market === 'BTTS' ? 'Yes' : market.includes('Over') ? 'Over' : fixture.homeTeam.name,
    confidence: conf,
    risk,
    minOdds: odds,
    stakeUnits: risk === 'low' ? 2 : risk === 'medium' ? 1.5 : 1,
    action,
    category,
    whyThisPick: pickSentences[idx % pickSentences.length],
    saferAlternative: category !== 'safe' ? 'Double Chance - ' + fixture.homeTeam.shortName + ' or Draw' : undefined,
    noBetConditions: [noBetConds[idx % noBetConds.length], noBetConds[(idx + 2) % noBetConds.length]],
    createdAt: new Date().toISOString(),
  };
}

export const picks: Pick[] = [
  // Safe picks - 30
  ...fixtures.slice(0, 30).map((f, i) => makePick(i, f, 'safe')),
  // Value picks - 30
  ...fixtures.slice(5, 35).map((f, i) => makePick(i + 30, f, 'value')),
  // Avoid picks - 20
  ...fixtures.slice(10, 30).map((f, i) => makePick(i + 60, f, 'avoid')),
];

// Leaderboard users
export const leaderboardUsers: LeaderboardEntry[] = Array.from({ length: 150 }, (_, i) => {
  const roi = +(Math.random() * 40 - 5).toFixed(1);
  const tiers: LeaderboardEntry['tier'][] = ['Bronze', 'Silver', 'Gold', 'Elite'];
  return {
    rank: i + 1,
    username: `bettor_${(i + 1).toString().padStart(3, '0')}`,
    roi,
    betCount: 30 + Math.floor(Math.random() * 200),
    maxDrawdown: +(Math.random() * 25).toFixed(1),
    winRate: +(45 + Math.random() * 30).toFixed(1),
    disciplineScore: +(60 + Math.random() * 40).toFixed(0) as unknown as number,
    avgUnitVariance: +(Math.random() * 0.5).toFixed(2),
    exposureControlScore: +(70 + Math.random() * 30).toFixed(0) as unknown as number,
    profitStreakDays: Math.floor(Math.random() * 14),
    disciplineStreakDays: Math.floor(Math.random() * 30),
    tier: tiers[Math.floor(i / 40)] || 'Bronze',
  };
}).sort((a, b) => b.roi - a.roi).map((u, i) => ({ ...u, rank: i + 1 }));

export const newsItems: NewsItem[] = Array.from({ length: 30 }, (_, i) => {
  const types: NewsItem['type'][] = ['injury', 'suspension', 'transfer', 'form'];
  const leagueIds = leagues.map(l => l.id);
  const lg = leagueIds[i % leagueIds.length];
  const teams = teamsByLeague[lg] || [];
  const team = teams[i % teams.length]?.name || 'Unknown';
  return {
    id: `news-${i}`,
    title: `${types[i % 4] === 'injury' ? `${team} key player doubtful` : types[i % 4] === 'suspension' ? `${team} midfielder suspended` : types[i % 4] === 'transfer' ? `${team} eyes January signing` : `${team} on ${3 + (i % 5)}-game winning run`}`,
    content: `Latest update regarding ${team} ahead of their upcoming fixture. This could impact betting markets significantly.`,
    league: lg,
    team,
    type: types[i % 4],
    date: new Date(Date.now() - i * 3600000 * 4).toISOString(),
  };
});

export const blogPosts: BlogPost[] = [
  {
    slug: 'understanding-expected-goals',
    title: 'Understanding Expected Goals (xG) in Football Betting',
    excerpt: 'How xG can transform your betting strategy and help you find value in the markets.',
    content: 'Expected Goals (xG) has revolutionized football analytics...',
    author: 'EdgeLedger Team', date: '2026-02-20', readTime: '5 min', category: 'Education',
  },
  {
    slug: 'bankroll-management-101',
    title: 'Bankroll Management 101: The Foundation of Profitable Betting',
    excerpt: 'Learn the unit system and why disciplined bankroll management separates winners from losers.',
    content: 'Bankroll management is the single most important skill...',
    author: 'EdgeLedger Team', date: '2026-02-18', readTime: '7 min', category: 'Strategy',
  },
  {
    slug: 'value-betting-explained',
    title: 'Value Betting Explained: Finding Edge in the Odds',
    excerpt: 'What is value betting and how EdgeLedger identifies value opportunities for you.',
    content: 'Value betting is the cornerstone of profitable gambling...',
    author: 'EdgeLedger Team', date: '2026-02-15', readTime: '6 min', category: 'Strategy',
  },
  {
    slug: 'btts-market-analysis',
    title: 'BTTS Market Analysis: When Both Teams Score',
    excerpt: 'Deep dive into the Both Teams to Score market and how to assess it properly.',
    content: 'The BTTS market is one of the most popular betting markets...',
    author: 'EdgeLedger Team', date: '2026-02-12', readTime: '4 min', category: 'Markets',
  },
  {
    slug: 'avoiding-common-mistakes',
    title: '5 Common Betting Mistakes and How to Avoid Them',
    excerpt: 'The most frequent errors bettors make and practical steps to eliminate them.',
    content: 'Even experienced bettors fall into predictable traps...',
    author: 'EdgeLedger Team', date: '2026-02-10', readTime: '5 min', category: 'Education',
  },
];

export const defaultBankrollPlan = {
  startingBankroll: 100000,
  currentBankroll: 112500,
  unitSize: 2,
  maxDailyExposure: 10,
  weeklyLossLimit: 15,
};

export const defaultBetLogs: BetLog[] = [
  { id: 'bl-1', date: '2026-02-23', match: 'Arsenal vs Man City', market: '1X2', odds: 2.10, stakeUnits: 2, result: 'won', payout: 4.20, notes: 'Strong home form' },
  { id: 'bl-2', date: '2026-02-23', match: 'Liverpool vs Chelsea', market: 'BTTS', odds: 1.75, stakeUnits: 1.5, result: 'won', payout: 2.625, notes: '' },
  { id: 'bl-3', date: '2026-02-22', match: 'Real Madrid vs Barcelona', market: 'Over 2.5', odds: 1.85, stakeUnits: 1, result: 'lost', payout: 0, notes: 'Tactical game' },
  { id: 'bl-4', date: '2026-02-22', match: 'Inter vs AC Milan', market: 'DNB', odds: 1.55, stakeUnits: 2, result: 'won', payout: 3.10, notes: '' },
  { id: 'bl-5', date: '2026-02-21', match: 'Juventus vs Napoli', market: 'Double Chance', odds: 1.35, stakeUnits: 2, result: 'won', payout: 2.70, notes: '' },
  { id: 'bl-6', date: '2026-02-21', match: 'Enyimba vs Rangers', market: '1X2', odds: 1.90, stakeUnits: 1.5, result: 'lost', payout: 0, notes: '' },
  { id: 'bl-7', date: '2026-02-20', match: 'Arsenal vs Tottenham', market: 'BTTS', odds: 1.80, stakeUnits: 1, result: 'won', payout: 1.80, notes: '' },
  { id: 'bl-8', date: '2026-02-20', match: 'Man City vs Newcastle', market: '1X2', odds: 1.45, stakeUnits: 2, result: 'won', payout: 2.90, notes: '' },
  { id: 'bl-9', date: '2026-02-19', match: 'Barcelona vs Atletico', market: 'Over 2.5', odds: 2.00, stakeUnits: 1, result: 'pending', payout: 0, notes: '' },
  { id: 'bl-10', date: '2026-02-19', match: 'PSG vs Bayern', market: 'DNB', odds: 1.65, stakeUnits: 1.5, result: 'void', payout: 1.5, notes: 'Match postponed' },
];

export const defaultSourceStatus = {
  fixtures: { status: 'live' as const, lastUpdated: new Date().toISOString() },
  odds: { status: 'live' as const, lastUpdated: new Date().toISOString() },
  news: { status: 'cached' as const, lastUpdated: new Date(Date.now() - 3600000).toISOString() },
};
