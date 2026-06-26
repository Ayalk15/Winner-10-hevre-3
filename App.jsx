import React, { useEffect, useMemo, useState } from 'react';
import { Trophy, Home, Swords, BarChart3, User, Shield, MessageCircle, Sparkles, Settings, Heart, BookOpen, Bell, Flame, Medal, Crown, Lock, Unlock, RotateCcw } from 'lucide-react';

const VERSION = 'Premium v9 — Ultimate';
const ADMIN_PASS = '2531';
const STORAGE_KEY = 'winner10hevre_v9_state';

const TEAMS = [
  'בית"ר ירושלים','מכבי תל אביב','מכבי חיפה','הפועל באר שבע','הפועל תל אביב','מכבי נתניה','הפועל חיפה','מכבי פתח תקווה','בני סכנין','עירוני טבריה','הפועל קריית שמונה','הפועל פתח תקווה','הפועל רמת גן','הפועל ירושלים'
];

const TEAM_BADGES = {
  'בית"ר ירושלים':'🟡','מכבי תל אביב':'🟨','מכבי חיפה':'🟢','הפועל באר שבע':'🔴','הפועל תל אביב':'🔴','מכבי נתניה':'🟡','הפועל חיפה':'🔴','מכבי פתח תקווה':'🔵','בני סכנין':'🔴','עירוני טבריה':'🔵','הפועל קריית שמונה':'🔵','הפועל פתח תקווה':'🔵','הפועל רמת גן':'🔴','הפועל ירושלים':'🔴'
};

const defaultPlayers = Array.from({ length: 10 }, (_, i) => ({
  id: `p${i + 1}`,
  name: `משתתף ${i + 1}`,
  avatar: ['👑','🧠','🔥','⚽','🦁','🎯','🚀','🛡️','⭐','🏆'][i],
  favoriteTeam: '',
  motto: ['בא לקחת אליפות','מנתח כל משחק','תחושת בטן חזקה','חי בשביל גולים','ג׳וקר מסוכן','מלך הבולים','תמיד בתמונה','הגנה חזקה','ווינר בנשמה','הולך עד הסוף'][i]
}));

function buildFixtures() {
  const teams = [...TEAMS];
  const rounds = {};
  let arr = [...teams];
  const dates = [];
  let d = new Date(2026, 7, 22);
  for (let i = 0; i < 36; i++) { dates.push(new Date(d)); d.setDate(d.getDate() + (i === 10 ? 3 : 7)); }
  const fmt = (date) => `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${String(date.getFullYear()).slice(2)}`;
  for (let r = 1; r <= 13; r++) {
    const games = [];
    for (let i = 0; i < 7; i++) {
      const home = arr[i]; const away = arr[13 - i];
      games.push({ id: i + 1, home: r % 2 ? home : away, away: r % 2 ? away : home, time: fmt(dates[r-1]), status: 'טרם התחיל' });
    }
    rounds[r] = games;
    arr = [arr[0], arr[13], ...arr.slice(1,13)];
  }
  for (let r = 14; r <= 26; r++) {
    rounds[r] = rounds[r-13].map(g => ({ ...g, home: g.away, away: g.home, time: fmt(dates[r-1]) }));
  }
  const playoffTop = [['מקום 1','מקום 6'],['מקום 2','מקום 5'],['מקום 3','מקום 4']];
  const playoffBottom = [['מקום 7','מקום 14'],['מקום 8','מקום 13'],['מקום 9','מקום 12'],['מקום 10','מקום 11']];
  for (let r = 27; r <= 36; r++) {
    const flip = r % 2 === 0;
    rounds[r] = [...playoffTop, ...playoffBottom].map(([a,b], i) => ({ id: i + 1, home: flip ? b : a, away: flip ? a : b, time: fmt(dates[r-1]), status: 'פלייאוף' }));
  }
  return rounds;
}

const allFixtures = buildFixtures();

function defaultState() {
  return {
    activePlayerId: 'p1',
    players: defaultPlayers,
    currentRound: 1,
    predictions: {},
    actualScores: {},
    jokers: {},
    chat: [{ id: 1, playerId: 'system', text: 'ברוכים הבאים לליגת הניחושים. בהצלחה לכולם!', time: new Date().toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}) }],
    notifications: ['גרסת v9 פעילה: נוספו חוקים, קבוצה אהודה, הישגים וצ׳אט.'],
    adminOpen: false,
    seasonLocked: false,
    lastSavedAt: null
  };
}

function loadState() {
  try { return { ...defaultState(), ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) }; } catch { return defaultState(); }
}

function getWinner(home, away) { if (home > away) return '1'; if (home < away) return '2'; return 'X'; }
function resultLabel(v) { return v === '1' ? 'בית' : v === '2' ? 'חוץ' : 'תיקו'; }
function predKey(playerId, round, gameId) { return `${playerId}_${round}_${gameId}`; }
function jokerKey(playerId, round) { return `${playerId}_${round}`; }

function scorePlayer(player, state, onlyRound = null) {
  let points = 0, exact = 0, direction = 0, misses = 0, played = 0, jokerHits = 0;
  Object.entries(state.actualScores).forEach(([key, actual]) => {
    if (!actual?.finished) return;
    const [, round, gameId] = key.split('_');
    if (onlyRound && Number(round) !== Number(onlyRound)) return;
    const p = state.predictions[predKey(player.id, round, gameId)];
    if (!p) return;
    played++;
    let local = 0;
    if (p.winner === actual.winner) {
      local += 2; direction++;
      if (Number(p.homeScore) === Number(actual.homeScore) && Number(p.awayScore) === Number(actual.awayScore)) { local += 4; exact++; }
    } else misses++;
    if (state.jokers[jokerKey(player.id, round)] === Number(gameId)) { if (local > 0) jokerHits++; local *= 2; }
    points += local;
  });
  return { points, exact, direction, misses, played, jokerHits, accuracy: played ? Math.round(((direction) / played) * 100) : 0 };
}

export default function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState('home');
  const [clock, setClock] = useState(new Date());
  const [toast, setToast] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [chatText, setChatText] = useState('');

  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastSavedAt: new Date().toISOString() })); }, [state]);
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2400); };
  const update = (patch) => setState(s => ({ ...s, ...patch }));
  const activePlayer = state.players.find(p => p.id === state.activePlayerId) || state.players[0];
  const ranking = useMemo(() => state.players.map(p => ({ ...p, ...scorePlayer(p, state) })).sort((a,b)=>b.points-a.points), [state]);
  const activeStats = scorePlayer(activePlayer, state);
  const roundFixtures = allFixtures[state.currentRound] || [];
  const predictedInRound = roundFixtures.filter(g => state.predictions[predKey(activePlayer.id, state.currentRound, g.id)]).length;
  const progress = roundFixtures.length ? Math.round(predictedInRound / roundFixtures.length * 100) : 0;

  const setPredictionScore = (gameId, side, delta) => setState(s => {
    const key = predKey(s.activePlayerId, s.currentRound, gameId);
    const curr = s.predictions[key] || { homeScore: 0, awayScore: 0, winner: 'X' };
    const updated = { ...curr, [side]: Math.max(0, Number(curr[side] || 0) + delta) };
    updated.winner = getWinner(updated.homeScore, updated.awayScore);
    return { ...s, predictions: { ...s.predictions, [key]: updated } };
  });
  const setPredictionWinner = (gameId, winner) => setState(s => {
    const key = predKey(s.activePlayerId, s.currentRound, gameId);
    const curr = s.predictions[key] || { homeScore: 0, awayScore: 0, winner };
    return { ...s, predictions: { ...s.predictions, [key]: { ...curr, winner } } };
  });
  const toggleJoker = (gameId) => setState(s => ({ ...s, jokers: { ...s.jokers, [jokerKey(s.activePlayerId, s.currentRound)]: s.jokers[jokerKey(s.activePlayerId, s.currentRound)] === gameId ? null : gameId } }));
  const setActualScore = (gameId, side, delta) => setState(s => {
    const key = `actual_${s.currentRound}_${gameId}`;
    const curr = s.actualScores[key] || { homeScore: 0, awayScore: 0, winner: 'X', finished: false };
    const updated = { ...curr, [side]: Math.max(0, Number(curr[side] || 0) + delta) };
    updated.winner = getWinner(updated.homeScore, updated.awayScore);
    return { ...s, actualScores: { ...s.actualScores, [key]: updated } };
  });
  const toggleFinished = (gameId) => setState(s => {
    const key = `actual_${s.currentRound}_${gameId}`;
    const curr = s.actualScores[key] || { homeScore: 0, awayScore: 0, winner: 'X', finished: false };
    return { ...s, actualScores: { ...s.actualScores, [key]: { ...curr, winner: getWinner(curr.homeScore, curr.awayScore), finished: !curr.finished } } };
  });
  const setFavoriteTeam = (team) => setState(s => ({ ...s, players: s.players.map(p => p.id === s.activePlayerId ? { ...p, favoriteTeam: team } : p) }));
  const renameActive = (name) => setState(s => ({ ...s, players: s.players.map(p => p.id === s.activePlayerId ? { ...p, name: name.slice(0,22) } : p) }));
  const loginAdmin = () => { if (adminPass === ADMIN_PASS) { update({ adminOpen: true }); flash('מצב מנהל הופעל'); } else flash('סיסמת מנהל שגויה'); };
  const resetDemo = () => { if (confirm('לאפס את כל הנתונים בדפדפן?')) { const d = defaultState(); setState(d); localStorage.removeItem(STORAGE_KEY); flash('המערכת אופסה'); } };
  const sendChat = () => { if (!chatText.trim()) return; setState(s => ({ ...s, chat: [...s.chat, { id: Date.now(), playerId: s.activePlayerId, text: chatText.trim(), time: new Date().toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}) }] })); setChatText(''); };

  const nav = [
    ['home','בית',Home], ['games','משחקים',Swords], ['table','טבלה',Trophy], ['stats','סטטיסטיקה',BarChart3], ['profile','אזור אישי',User], ['rules','חוקים',BookOpen], ['chat','צ׳אט',MessageCircle], ['admin','מנהל',Settings]
  ];

  return <div className="app" dir="rtl">
    <div className="stadiumGlow" />
    {toast && <div className="toast">{toast}</div>}
    <header className="topbar">
      <div className="brand"><div className="logo"><Trophy size={23}/></div><div><h1>10 חבר׳ה — יוספטל</h1><p>Winner League 26/27 · {VERSION}</p></div></div>
      <div className="clock"><b>{clock.toLocaleTimeString('he-IL')}</b><span>{clock.toLocaleDateString('he-IL',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'})}</span></div>
      <div className="activeUser"><span>{activePlayer.avatar}</span><b>{activePlayer.name}</b><small>{activePlayer.favoriteTeam || 'בחר קבוצה אהודה'}</small></div>
    </header>

    <nav className="nav">{nav.map(([id,label,Icon]) => <button key={id} onClick={()=>setTab(id)} className={tab===id?'on':''}><Icon size={17}/><span>{label}</span></button>)}</nav>

    <main className="main">
      {tab === 'home' && <section className="hero card">
        <div className="heroBadge"><Sparkles size={16}/> Live Control Room</div>
        <h2>ליגת הניחושים הפרטית   .</h2>
        <p>משחקים, ניחושים, ג׳וקר, ניקוד, טבלה, אזור אישי, הישגים, צ׳אט ופאנל מנהל — הכול במקום אחד.</p>
        <div className="heroGrid">
          <Stat title="התקדמות המחזור" value={`${progress}%`} sub={`${predictedInRound}/${roundFixtures.length} משחקים`} />
          <Stat title="הניקוד שלך" value={activeStats.points} sub={`${activeStats.accuracy}% דיוק`} />
          <Stat title="משתתפים" value={state.players.length} sub="ליגה פרטית" />
          <Stat title="מחזור נוכחי" value={state.currentRound} sub={state.currentRound >= 27 ? 'פלייאוף' : 'ליגה סדירה'} />
        </div>
        <button className="primary" onClick={()=>setTab('games')}>⚽ עבור לניחוש המחזור</button>
        <div className="notice"><Bell size={17}/> {state.notifications[0]}</div>
      </section>}

      {tab === 'games' && <section className="space">
        <div className="card rowBetween"><div><h2>⚽ ניחושי מחזור {state.currentRound}</h2><p>בחר תוצאה, סמן ג׳וקר אחד, וצפה בניקוד אחרי שהמנהל סוגר משחק.</p></div><select value={state.currentRound} onChange={e=>update({currentRound:Number(e.target.value)})}>{Array.from({length:36},(_,i)=><option key={i+1} value={i+1}>{i+1>=27?'🔥 פלייאוף':'⚽ מחזור'} {i+1}</option>)}</select></div>
        <div className="progress"><span style={{width:`${progress}%`}}></span></div>
        {roundFixtures.map(game => {
          const p = state.predictions[predKey(activePlayer.id, state.currentRound, game.id)] || { homeScore:0, awayScore:0, winner:'X' };
          const actual = state.actualScores[`actual_${state.currentRound}_${game.id}`] || { homeScore:0, awayScore:0, winner:'X', finished:false };
          const isJoker = state.jokers[jokerKey(activePlayer.id, state.currentRound)] === game.id;
          return <article className={`match card ${isJoker?'joker':''}`} key={game.id}>
            <div className="matchTop"><span>{game.time} · {game.status}</span><button onClick={()=>toggleJoker(game.id)} className={isJoker?'jokerBtn on':'jokerBtn'}>🃏 {isJoker?'ג׳וקר פעיל':'סמן ג׳וקר'}</button></div>
            <div className="teams"><Team name={game.home}/><div className="scoreBox"><button onClick={()=>setPredictionScore(game.id,'homeScore',1)}>+</button><b>{p.homeScore}:{p.awayScore}</b><button onClick={()=>setPredictionScore(game.id,'awayScore',1)}>+</button><div><button onClick={()=>setPredictionScore(game.id,'homeScore',-1)}>- בית</button><button onClick={()=>setPredictionScore(game.id,'awayScore',-1)}>- חוץ</button></div></div><Team name={game.away}/></div>
            <div className="pickRow">{['1','X','2'].map(w => <button key={w} onClick={()=>setPredictionWinner(game.id,w)} className={p.winner===w?'picked':''}>{w} · {resultLabel(w)}</button>)}</div>
            {actual.finished && <div className="actual">תוצאה סופית: <b>{actual.homeScore}:{actual.awayScore}</b> · ניצח: {resultLabel(actual.winner)}</div>}
          </article>
        })}
      </section>}

      {tab === 'table' && <section className="card"><h2>🏆 טבלת דירוג</h2><div className="leaderboard">{ranking.map((p,i)=><div className="rank" key={p.id}><div className="place">{i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</div><div className="avatar">{p.avatar}</div><div className="grow"><b>{p.name}</b><small>{p.favoriteTeam ? `${TEAM_BADGES[p.favoriteTeam]||'⚽'} ${p.favoriteTeam}` : 'ללא קבוצה אהודה'}</small></div><div className="points">{p.points}<small>נק׳</small></div></div>)}</div></section>}

      {tab === 'stats' && <section className="space"><div className="card"><h2>📊 סטטיסטיקות עונה</h2><div className="heroGrid"><Stat title="דיוק שלך" value={`${activeStats.accuracy}%`} sub="כיוון נכון"/><Stat title="בולים" value={activeStats.exact} sub="תוצאה מדויקת"/><Stat title="ג׳וקרים שפגעו" value={activeStats.jokerHits} sub="כפל ניקוד"/><Stat title="פספוסים" value={activeStats.misses} sub="משחקים סגורים"/></div></div><Achievements stats={activeStats}/></section>}

      {tab === 'profile' && <section className="space"><div className="card profile"><div className="bigAvatar">{activePlayer.avatar}</div><h2>{activePlayer.name}</h2><input value={activePlayer.name} onChange={e=>renameActive(e.target.value)} placeholder="שם משתתף"/><label>❤️ הקבוצה שאני אוהד</label><select value={activePlayer.favoriteTeam} onChange={e=>setFavoriteTeam(e.target.value)}><option value="">בחר קבוצה</option>{TEAMS.map(t=><option key={t} value={t}>{TEAM_BADGES[t]} {t}</option>)}<option value="אחר">אחר</option></select><div className="heroGrid"><Stat title="נקודות" value={activeStats.points}/><Stat title="דיוק" value={`${activeStats.accuracy}%`}/></div></div><div className="card"><h3>החלפת משתתף פעיל</h3><div className="playersGrid">{state.players.map(p=><button key={p.id} className={p.id===state.activePlayerId?'player on':'player'} onClick={()=>update({activePlayerId:p.id})}><span>{p.avatar}</span><b>{p.name}</b><small>{p.favoriteTeam||'ללא קבוצה'}</small></button>)}</div></div></section>}

      {tab === 'rules' && <section className="space"><div className="card"><h2>📖 חוקי המשחק ושיטת ניקוד</h2><div className="rules"><Rule icon="✅" title="ניחוש כיוון" text="פגיעה ב-1 / X / 2 מעניקה 2 נקודות."/><Rule icon="🎯" title="תוצאה מדויקת" text="פגיעה בתוצאה המדויקת מוסיפה 4 נקודות. סה״כ 6 נקודות."/><Rule icon="🃏" title="ג׳וקר מחזור" text="אפשר לבחור משחק ג׳וקר אחד בכל מחזור. כל ניקוד מהמשחק מוכפל."/><Rule icon="🏆" title="טבלת דירוג" text="המיקום נקבע לפי סך הנקודות מכל המשחקים שהסתיימו."/><Rule icon="🔥" title="הישגים" text="בולים, רצפים וג׳וקרים מוצלחים מוצגים באזור הסטטיסטיקה."/><Rule icon="🔐" title="מנהל" text="רק מנהל מורשה יכול לסגור משחקים ולעדכן תוצאות אמת."/></div></div></section>}

      {tab === 'chat' && <section className="card"><h2>💬 צ׳אט הליגה</h2><div className="chatBox">{state.chat.slice(-30).map(m=>{const p=state.players.find(x=>x.id===m.playerId); return <div className="msg" key={m.id}><b>{p?.avatar||'🤖'} {p?.name||'מערכת'}</b><span>{m.text}</span><small>{m.time}</small></div>})}</div><div className="chatInput"><input value={chatText} onChange={e=>setChatText(e.target.value)} placeholder="כתוב הודעה לחבר׳ה..."/><button onClick={sendChat}>שלח</button></div></section>}

      {tab === 'admin' && <section className="space">{!state.adminOpen ? <div className="card"><h2>🔧 פאנל מנהל</h2><p>הזן סיסמה כדי לעדכן תוצאות אמת, לנעול משחקים ולאפס נתונים.</p><input type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} placeholder="סיסמת מנהל"/><button className="primary" onClick={loginAdmin}>כניסה למנהל</button></div> : <div className="card"><div className="rowBetween"><h2>🔧 פאנל מנהל פעיל</h2><button onClick={()=>update({adminOpen:false})}><Lock size={16}/> צא</button></div><div className="adminGames">{roundFixtures.map(g=>{const a=state.actualScores[`actual_${state.currentRound}_${g.id}`]||{homeScore:0,awayScore:0,winner:'X',finished:false};return <div className="adminGame" key={g.id}><b>{g.home} - {g.away}</b><div><button onClick={()=>setActualScore(g.id,'homeScore',-1)}>-</button><span>{a.homeScore}:{a.awayScore}</span><button onClick={()=>setActualScore(g.id,'homeScore',1)}>+ בית</button><button onClick={()=>setActualScore(g.id,'awayScore',1)}>+ חוץ</button><button onClick={()=>setActualScore(g.id,'awayScore',-1)}>-</button></div><button className={a.finished?'danger':'success'} onClick={()=>toggleFinished(g.id)}>{a.finished?<Unlock size={15}/>:<Lock size={15}/>} {a.finished?'פתח משחק':'סיום ונעילה'}</button></div>})}</div><button className="danger wide" onClick={resetDemo}><RotateCcw size={16}/> איפוס מלא</button></div>}</section>}
    </main>
  </div>;
}

function Team({name}) { return <div className="team"><span>{TEAM_BADGES[name]||'⚽'}</span><b>{name}</b></div>; }
function Stat({title,value,sub=''}) { return <div className="stat"><small>{title}</small><b>{value}</b>{sub&&<span>{sub}</span>}</div>; }
function Rule({icon,title,text}) { return <div className="rule"><span>{icon}</span><div><b>{title}</b><p>{text}</p></div></div>; }
function Achievements({stats}) { const items=[['🏅','פותח עונה',true],['🎯','מלך הבולים',stats.exact>=3],['🃏','אשף הג׳וקר',stats.jokerHits>=2],['🔥','דיוק גבוה',stats.accuracy>=60],['🛡️','לא מפספס',stats.misses===0 && stats.played>0]]; return <div className="card"><h2>🏅 הישגים</h2><div className="achievements">{items.map(([ico,t,on])=><div key={t} className={on?'achievement on':'achievement'}><span>{ico}</span><b>{t}</b><small>{on?'נפתח':'נעול'}</small></div>)}</div></div>; }
