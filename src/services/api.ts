import { fixtures, picks, leagues, leaderboardUsers, newsItems, blogPosts, defaultBankrollPlan, defaultBetLogs, defaultSourceStatus, type Fixture, type Pick, type BetLog, type LeaderboardEntry, type BlogPost, type NewsItem } from '@/data/mockData';
import { storage } from '@/lib/storage';

const delay = (ms?: number) => new Promise(r => setTimeout(r, ms ?? (300 + Math.random() * 500)));

// Auth
export async function loginWithPhone(phone: string) {
  await delay(600);
  if (!phone || phone.length < 8) throw new Error('Invalid phone number');
  return { success: true, phone };
}

export async function verifyOtp(phone: string, otp: string) {
  await delay(800);
  if (otp !== '123456') throw new Error('Invalid OTP code');
  const session = { phone, authenticated: true };
  storage.setSession(session);
  return session;
}

export async function getSession() {
  await delay(100);
  return storage.getSession();
}

export async function logout() {
  await delay(200);
  storage.setSession(null);
  return { success: true };
}

// Data
export async function getLeagues() {
  await delay();
  return leagues;
}

export async function getFixtures(filters?: { dateRange?: string; league?: string; search?: string; status?: string }) {
  await delay();
  let result = [...fixtures];
  if (filters?.dateRange) result = result.filter(f => f.day === filters.dateRange);
  if (filters?.league) result = result.filter(f => f.league.id === filters.league);
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(f => f.homeTeam.name.toLowerCase().includes(s) || f.awayTeam.name.toLowerCase().includes(s));
  }
  if (filters?.status) result = result.filter(f => f.status === filters.status);
  return result;
}

export async function getMatchById(id: string) {
  await delay();
  const match = fixtures.find(f => f.id === id);
  if (!match) throw new Error('Match not found');
  return {
    ...match,
    signals: {
      attackStrength: { home: 72 + Math.random() * 20, away: 65 + Math.random() * 20 },
      defenseStrength: { home: 68 + Math.random() * 20, away: 60 + Math.random() * 20 },
      goalExpectancy: +(1.5 + Math.random() * 2).toFixed(2),
      bttsLikelihood: +(40 + Math.random() * 40).toFixed(0),
      tempo: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      volatility: +(30 + Math.random() * 50).toFixed(0),
    },
    picks: picks.filter(p => p.fixtureId === id),
    news: newsItems.filter(n => n.team === match.homeTeam.name || n.team === match.awayTeam.name).slice(0, 5),
  };
}

export async function getPicks(filters?: { day?: string; category?: string; league?: string; market?: string; risk?: string; confidenceMin?: number }) {
  await delay();
  // include admin-created picks
  const adminPicks = storage.getAdminPicks() as Pick[];
  let all = [...picks, ...adminPicks];
  if (filters?.day) all = all.filter(p => p.fixture.day === filters.day);
  if (filters?.category) all = all.filter(p => p.category === filters.category);
  if (filters?.league) all = all.filter(p => p.fixture.league.id === filters.league);
  if (filters?.market) all = all.filter(p => p.market === filters.market);
  if (filters?.risk) all = all.filter(p => p.risk === filters.risk);
  if (filters?.confidenceMin) all = all.filter(p => p.confidence >= filters.confidenceMin!);
  return all;
}

export async function getPickById(id: string) {
  await delay();
  const adminPicks = storage.getAdminPicks() as Pick[];
  const p = [...picks, ...adminPicks].find(p => p.id === id);
  if (!p) throw new Error('Pick not found');
  return p;
}

export async function saveUserPick(pickId: string) {
  await delay(200);
  const saved = storage.getSavedPicks();
  if (!saved.includes(pickId)) { saved.push(pickId); storage.setSavedPicks(saved); }
  return saved;
}

export async function listUserSavedPicks() {
  await delay();
  return storage.getSavedPicks();
}

// Tracker
export async function createBetLog(payload: Omit<BetLog, 'id'>) {
  await delay(400);
  const logs = storage.getBetLogs() as BetLog[];
  const log = { ...payload, id: `bl-${Date.now()}` };
  logs.push(log);
  storage.setBetLogs(logs);
  return log;
}

export async function updateBetLog(id: string, payload: Partial<BetLog>) {
  await delay(400);
  const logs = storage.getBetLogs() as BetLog[];
  const idx = logs.findIndex((l: BetLog) => l.id === id);
  if (idx === -1) throw new Error('Bet log not found');
  logs[idx] = { ...(logs[idx] as BetLog), ...payload };
  storage.setBetLogs(logs);
  return logs[idx];
}

export async function listBetLogs(filters?: { dateRange?: string; league?: string; market?: string; status?: string }) {
  await delay();
  let logs = storage.getBetLogs() as BetLog[];
  if (logs.length === 0) { logs = defaultBetLogs; storage.setBetLogs(logs); }
  if (filters?.status) logs = logs.filter(l => l.result === filters.status);
  if (filters?.market) logs = logs.filter(l => l.market === filters.market);
  return logs;
}

export async function exportBetLogsCSV() {
  await delay(300);
  const logs = storage.getBetLogs() as BetLog[];
  const headers = 'Date,Match,Market,Odds,Stake Units,Result,Payout,Notes';
  const rows = logs.map(l => `${l.date},${l.match},${l.market},${l.odds},${l.stakeUnits},${l.result},${l.payout},"${l.notes}"`);
  return [headers, ...rows].join('\n');
}

// Analytics
export async function getAnalyticsSummary() {
  await delay();
  const logs = storage.getBetLogs() as BetLog[];
  if (logs.length === 0) storage.setBetLogs(defaultBetLogs);
  const settled = (storage.getBetLogs() as BetLog[]).filter(l => l.result === 'won' || l.result === 'lost');
  const wins = settled.filter(l => l.result === 'won');
  const totalPL = settled.reduce((s, l) => s + (l.result === 'won' ? l.payout - l.stakeUnits : -l.stakeUnits), 0);
  return {
    totalPL: +totalPL.toFixed(2),
    roi: settled.length ? +((totalPL / settled.reduce((s, l) => s + l.stakeUnits, 0)) * 100).toFixed(1) : 0,
    winRate: settled.length ? +((wins.length / settled.length) * 100).toFixed(1) : 0,
    avgOdds: settled.length ? +(settled.reduce((s, l) => s + l.odds, 0) / settled.length).toFixed(2) : 0,
    maxDrawdown: 8.2,
    totalBets: settled.length,
    bestMarket: 'Double Chance',
    weeklyInsight: 'Your risk rose this week (unit variance +32%)',
  };
}

export async function getAnalyticsSeries() {
  await delay();
  const days = 14;
  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - i));
    return {
      date: d.toISOString().slice(0, 10),
      pl: +(Math.random() * 6 - 2).toFixed(2),
      roi: +(Math.random() * 10 - 3).toFixed(1),
      winRate: +(45 + Math.random() * 30).toFixed(1),
    };
  });
  let cumPL = 0;
  return series.map(s => { cumPL += s.pl; return { ...s, cumPL: +cumPL.toFixed(2) }; });
}

// Leaderboards
export async function getLeaderboard(type: 'roi' | 'discipline' | 'streaks', _leagueFilter?: string) {
  await delay();
  const sorted = [...leaderboardUsers];
  if (type === 'discipline') sorted.sort((a, b) => b.disciplineScore - a.disciplineScore);
  if (type === 'streaks') sorted.sort((a, b) => b.profitStreakDays - a.profitStreakDays);
  return sorted.slice(0, 50).map((u, i) => ({ ...u, rank: i + 1 }));
}

// Reliability
export async function getSourceStatus() {
  await delay(200);
  const custom = storage.getSourceStatus();
  return custom || defaultSourceStatus;
}

export async function setSourceStatus(payload: Record<string, unknown>) {
  await delay(200);
  storage.setSourceStatus(payload);
  return payload;
}

// Admin
export async function adminCreatePick(payload: Pick) {
  await delay(400);
  const adminPicks = storage.getAdminPicks() as Pick[];
  adminPicks.push(payload);
  storage.setAdminPicks(adminPicks);
  return payload;
}

export async function adminUpdatePick(id: string, payload: Partial<Pick>) {
  await delay(400);
  const adminPicks = storage.getAdminPicks() as Pick[];
  const idx = adminPicks.findIndex((p: Pick) => p.id === id);
  if (idx !== -1) adminPicks[idx] = { ...(adminPicks[idx] as Pick), ...payload };
  storage.setAdminPicks(adminPicks);
  return adminPicks[idx];
}

export async function adminListPicks() {
  await delay();
  return storage.getAdminPicks() as Pick[];
}

export async function adminSetSourceStatus(payload: Record<string, unknown>) {
  return setSourceStatus(payload);
}

// Blog
export async function getBlogPosts() {
  await delay();
  return blogPosts;
}

export async function getBlogPost(slug: string) {
  await delay();
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) throw new Error('Post not found');
  return post;
}

// Bankroll
export async function getBankrollPlan() {
  await delay(200);
  return storage.getBankrollPlan() || defaultBankrollPlan;
}

export async function saveBankrollPlan(plan: typeof defaultBankrollPlan) {
  await delay(200);
  storage.setBankrollPlan(plan);
  return plan;
}
