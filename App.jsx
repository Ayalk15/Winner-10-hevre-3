import React, { useEffect, useMemo, useState } from 'react';
import { Trophy, Home, Users, BarChart3, Shield, Settings, Info, Plus, Save, Trash2, LogOut } from 'lucide-react';

const VERSION = 'Premium v6 — מערכת מלאה';
const ADMIN_PASSWORD = '2531';

const teams = {
  'מכבי ת״א': '🟡', 'מכבי חיפה': '🟢', 'בית״ר י-ם': '🟡', 'הפועל ב״ש': '🔴', 'הפועל ת״א': '🔴',
  'מכבי נתניה': '🟡', 'הפועל חיפה': '🔴', 'מכבי פ״ת': '🔵', 'בני סכנין': '🔴', 'הפועל ק״ש': '🔵',
  'הפועל פ״ת': '🔵', 'הפועל ר״ג': '🔴', 'הפועל י-ם': '🔴', 'עירוני טבריה': '🔵'
};

const fixtures = {
  1: [
    { id: 1, home: 'מכבי פ״ת', away: 'הפועל ק״ש', time: '22/08/26' },
    { id: 2, home: 'עירוני טבריה', away: 'הפועל פ״ת', time: '22/08/26' },
    { id: 3, home: 'הפועל י-ם', away: 'מכבי ת״א', time: '22/08/26' },
    { id: 4, home: 'מכבי חיפה', away: 'הפועל ר״ג', time: '22/08/26' },
    { id: 5, home: 'הפועל ב״ש', away: 'הפועל חיפה', time: '22/08/26' },
    { id: 6, home: 'בית״ר י-ם', away: 'הפועל ת״א', time: '22/08/26' },
    { id: 7, home: 'מכבי נתניה', away: 'בני סכנין', time: '22/08/26' }
  ],
  2: [
    { id: 1, home: 'בני סכנין', away: 'מכבי פ״ת', time: '29/08/26' },
    { id: 2, home: 'מכבי נתניה', away: 'הפועל י-ם', time: '29/08/26' },
    { id: 3, home: 'הפועל ת״א', away: 'מכבי חיפה', time: '29/08/26' },
    { id: 4, home: 'הפועל ב״ש', away: 'הפועל ר״ג', time: '29/08/26' },
    { id: 5, home: 'מכבי חיפה', away: 'מכבי ת״א', time: '29/08/26' },
    { id: 6, home: 'הפועל פ״ת', away: 'בית״ר י-ם', time: '29/08/26' },
    { id: 7, home: 'עירוני טבריה', away: 'הפועל ק״ש', time: '29/08/26' }
  ],
  3: [
    { id: 1, home: 'מכבי פ״ת', away: 'עירוני טבריה', time: '05/09/26' },
    { id: 2, home: 'הפועל ק״ש', away: 'הפועל י-ם', time: '05/09/26' },
    { id: 3, home: 'הפועל פ״ת', away: 'מכבי חיפה', time: '05/09/26' },
    { id: 4, home: 'מכבי ת״א', away: 'הפועל ב״ש', time: '05/09/26' },
    { id: 5, home: 'הפועל ר״ג', away: 'הפועל ת״א', time: '05/09/26' },
    { id: 6, home: 'הפועל חיפה', away: 'מכבי נתניה', time: '05/09/26' },
    { id: 7, home: 'בית״ר י-ם', away: 'בני סכנין', time: '05/09/26' }
  ]
};
for (let i = 4; i <= 26; i++) fixtures[i] = fixtures[((i - 1) % 3) + 1].map(g => ({ ...g, time: `${String(7 + i).padStart(2,'0')}/10/26` }));
for (let i = 27; i <= 36; i++) fixtures[i] = [1,2,3].map(n => ({ id: n, home: `מקום ${n}`, away: `מקום ${7-n}`, time: `${String(i-14).padStart(2,'0')}/03/27` }));

const emptyTournament = { champion: '', topScorer: '', topAssists: '', favoriteTeam: '' };
const defaultUsers = Array.from({ length: 10 }, (_, i) => ({ id: `u${i+1}`, name: `משתתף ${i+1}`, pin: String(1000+i+1), avatar: ['👑','⚽','🧠','🔥','🦁','🚀','🛡️','🎯','⭐','🏆'][i] }));

function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function resultFromScore(h, a) { return h > a ? '1' : h < a ? '2' : 'X'; }
function gameKey(md, id) { return `${md}-${id}`; }
function pointsFor(pred, actual, joker) {
  if (!pred || !actual?.isFinished) return 0;
  let p = 0;
  if (pred.winner === actual.winner) {
    p = 2;
    if (Number(pred.homeScore) === Number(actual.homeScore) && Number(pred.awayScore) === Number(actual.awayScore)) p = 6;
  }
  return joker ? p * 2 : p;
}

export default function App() {
  const [tab, setTab] = useState('home');
  const [now, setNow] = useState(new Date());
  const [matchday, setMatchday] = useState(1);
  const [users, setUsers] = useState(() => load('w10_users', defaultUsers));
  const [currentUserId, setCurrentUserId] = useState(() => load('w10_currentUserId', 'u1'));
  const [predictions, setPredictions] = useState(() => load('w10_predictions', {}));
  const [jokers, setJokers] = useState(() => load('w10_jokers', {}));
  const [actualScores, setActualScores] = useState(() => load('w10_actualScores', {}));
  const [tournaments, setTournaments] = useState(() => load('w10_tournaments', {}));
  const [admin, setAdmin] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => save('w10_users', users), [users]);
  useEffect(() => save('w10_currentUserId', currentUserId), [currentUserId]);
  useEffect(() => save('w10_predictions', predictions), [predictions]);
  useEffect(() => save('w10_jokers', jokers), [jokers]);
  useEffect(() => save('w10_actualScores', actualScores), [actualScores]);
  useEffect(() => save('w10_tournaments', tournaments), [tournaments]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); }, [toast]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const currentTournament = tournaments[currentUser?.id] || emptyTournament;

  const leaderboard = useMemo(() => users.map(u => {
    let points = 0, exact = 0, direction = 0, misses = 0;
    Object.entries(actualScores).forEach(([k, actual]) => {
      if (!actual?.isFinished) return;
      const pred = predictions[u.id]?.[k];
      const [md, gid] = k.split('-');
      const joker = jokers[u.id]?.[md] === Number(gid);
      const p = pointsFor(pred, actual, joker);
      points += p;
      if (pred) {
        if (p >= (joker ? 12 : 6)) exact++;
        else if (p > 0) direction++;
        else misses++;
      }
    });
    return { ...u, points, exact, direction, misses, success: exact + direction };
  }).sort((a,b) => b.points - a.points), [users, predictions, actualScores, jokers]);

  const totalGames = fixtures[matchday]?.length || 0;
  const predictedNow = Object.keys(predictions[currentUser?.id] || {}).filter(k => k.startsWith(`${matchday}-`)).length;
  const progress = totalGames ? Math.round((predictedNow / totalGames) * 100) : 0;

  const notify = (msg) => setToast(msg);

  const updatePrediction = (id, patch) => {
    const k = gameKey(matchday, id);
    setPredictions(prev => {
      const userPreds = prev[currentUser.id] || {};
      const cur = userPreds[k] || { homeScore: 0, awayScore: 0, winner: 'X' };
      const updated = { ...cur, ...patch };
      updated.winner = resultFromScore(updated.homeScore, updated.awayScore);
      return { ...prev, [currentUser.id]: { ...userPreds, [k]: updated } };
    });
  };

  const setWinner = (id, winner) => {
    const k = gameKey(matchday, id);
    setPredictions(prev => {
      const userPreds = prev[currentUser.id] || {};
      const cur = userPreds[k] || { homeScore: 0, awayScore: 0, winner: 'X' };
      return { ...prev, [currentUser.id]: { ...userPreds, [k]: { ...cur, winner } } };
    });
  };

  const toggleJoker = (id) => setJokers(prev => ({ ...prev, [currentUser.id]: { ...(prev[currentUser.id] || {}), [matchday]: (prev[currentUser.id]?.[matchday] === id ? null : id) } }));

  const adminScore = (id, patch) => {
    const k = gameKey(matchday, id);
    setActualScores(prev => {
      const cur = prev[k] || { homeScore: 0, awayScore: 0, winner: 'X', isFinished: false };
      const next = { ...cur, ...patch };
      next.winner = resultFromScore(next.homeScore, next.awayScore);
      return { ...prev, [k]: next };
    });
  };

  const addUser = () => {
    const n = users.length + 1;
    const u = { id: `u${Date.now()}`, name: `משתתף ${n}`, pin: '0000', avatar: '⚽' };
    setUsers([...users, u]);
    notify('משתתף חדש נוסף');
  };

  const resetAll = () => {
    if (!confirm('לאפס את כל הנתונים במכשיר הזה?')) return;
    localStorage.clear(); location.reload();
  };

  return <div className="app"><div className="shell">
    <header className="top">
      <div className="brand">
        <div className="logo">🏆</div>
        <div><h1 className="title">10 חבר׳ה — יוספטל</h1><div className="sub">Winner League 26/27 · {VERSION}</div></div>
        <div className="clock">{now.toLocaleDateString('he-IL')}<br />{now.toLocaleTimeString('he-IL')}</div>
      </div>
      <nav className="nav">
        {[['home',Home,'בית'],['games',Trophy,'משחקים'],['league',Users,'טבלה'],['stats',BarChart3,'סטט׳'],['profile',Shield,'אישי'],['admin',Settings,'מנהל']].map(([id,Icon,label]) => <button key={id} className={tab===id?'active':''} onClick={() => setTab(id)}><Icon size={15}/><br/>{label}</button>)}
      </nav>
    </header>

    {tab === 'home' && <section className="card hero">
      <span className="badge">🔥 Live Control Room</span>
      <h2>ליגת ניחושים פרטית שנראית כמו אפליקציה אמיתית.</h2>
      <p className="muted">משתתפים, ניחושים, ג׳וקר, ניקוד, טבלה, מצב מנהל ושמירה בדפדפן. כרגע הנתונים נשמרים במכשיר שלך. בשלב הבא נחבר Firebase כדי שכל החברים יראו אותו דבר.</p>
      <div className="grid2"><div className="stat"><b>{users.length}</b><span>משתתפים</span></div><div className="stat"><b>{progress}%</b><span>התקדמות מחזור</span></div></div>
      <div className="progress" style={{margin:'16px 0'}}><div className="bar" style={{width:`${progress}%`}} /></div>
      <button className="primary" onClick={() => setTab('games')}>⚽ עבור לניחוש המחזור</button>
    </section>}

    {tab === 'games' && <section>
      <div className="card">
        <div className="row"><b>משתמש פעיל</b><select className="select" style={{maxWidth:220}} value={currentUserId} onChange={e=>setCurrentUserId(e.target.value)}>{users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
        <div style={{height:10}} />
        <label className="small muted">בחר מחזור</label>
        <select className="select" value={matchday} onChange={e=>setMatchday(Number(e.target.value))}>{Array.from({length:36},(_,i)=><option key={i+1} value={i+1}>{i+1>=27?'פלייאוף':'מחזור'} {i+1}</option>)}</select>
        <div className="progress" style={{marginTop:14}}><div className="bar" style={{width:`${progress}%`}} /></div>
        <p className="small muted">ניחשת {predictedNow}/{totalGames} משחקים במחזור הזה</p>
      </div>
      {fixtures[matchday]?.map(g => {
        const k = gameKey(matchday,g.id);
        const pred = predictions[currentUser.id]?.[k] || {homeScore:0,awayScore:0,winner:'X'};
        const actual = actualScores[k];
        const joker = jokers[currentUser.id]?.[matchday] === g.id;
        const earned = pointsFor(pred, actual, joker);
        return <div key={g.id} className={`card match ${joker?'joker':''}`}>
          <div className="row"><span className="pill">{g.time}</span><button className="ghost" onClick={()=>toggleJoker(g.id)}>{joker?'🃏 ג׳וקר פעיל':'🃏 סמן ג׳וקר'}</button></div>
          <div className="teams"><div className="team"><span className="emblem">{teams[g.home]||'⚽'}</span>{g.home}</div><div className="vs">VS</div><div className="team"><span className="emblem">{teams[g.away]||'⚽'}</span>{g.away}</div></div>
          <div className="score"><div className="counter"><button onClick={()=>updatePrediction(g.id,{awayScore:Math.max(0,pred.awayScore-1)})}>−</button><span>{pred.awayScore}</span><button onClick={()=>updatePrediction(g.id,{awayScore:pred.awayScore+1})}>+</button></div><b>:</b><div className="counter"><button onClick={()=>updatePrediction(g.id,{homeScore:Math.max(0,pred.homeScore-1)})}>−</button><span>{pred.homeScore}</span><button onClick={()=>updatePrediction(g.id,{homeScore:pred.homeScore+1})}>+</button></div></div>
          <div className="choice">{['1','X','2'].map(x=><button key={x} className={pred.winner===x?'active':''} onClick={()=>setWinner(g.id,x)}>{x==='1'?'בית':x==='X'?'תיקו':'חוץ'}</button>)}</div>
          {actual?.isFinished && <div className="row"><span className="pill">תוצאה: {actual.homeScore}-{actual.awayScore}</span><b style={{color:'#facc15'}}>+{earned} נק׳</b></div>}
        </div>
      })}
      <button className="primary" onClick={()=>notify('הניחושים נשמרו בדפדפן')}>💾 שמור ניחושים</button>
    </section>}

    {tab === 'league' && <section className="card"><h2>🏆 טבלת דירוג</h2><table><thead><tr><th>#</th><th>משתתף</th><th>נק׳</th><th>בולים</th></tr></thead><tbody>{leaderboard.map((u,i)=><tr key={u.id}><td className="medal">{i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</td><td>{u.avatar} {u.name}</td><td>{u.points}</td><td>{u.exact}</td></tr>)}</tbody></table></section>}

    {tab === 'stats' && <section><div className="card"><h2>📊 סטטיסטיקות</h2><div className="grid2"><div className="stat"><b>{leaderboard[0]?.points||0}</b><span>מוביל</span></div><div className="stat"><b>{leaderboard.reduce((s,u)=>s+u.exact,0)}</b><span>סה״כ בולים</span></div><div className="stat"><b>{Object.values(actualScores).filter(x=>x.isFinished).length}</b><span>משחקים סגורים</span></div><div className="stat"><b>{progress}%</b><span>השלמת מחזור</span></div></div></div></section>}

    {tab === 'profile' && <section className="card"><h2>👤 אזור אישי</h2><div className="participant"><div className="avatar">{currentUser.avatar}</div><div><b>{currentUser.name}</b><div className="small muted">PIN: {currentUser.pin}</div></div><span className="pill">פעיל</span></div><input value={currentTournament.champion} onChange={e=>setTournaments(p=>({...p,[currentUser.id]:{...currentTournament,champion:e.target.value}}))} placeholder="האלופה שלי" style={{marginTop:12}}/><input value={currentTournament.topScorer} onChange={e=>setTournaments(p=>({...p,[currentUser.id]:{...currentTournament,topScorer:e.target.value}}))} placeholder="מלך השערים שלי" style={{marginTop:10}}/><input value={currentTournament.topAssists} onChange={e=>setTournaments(p=>({...p,[currentUser.id]:{...currentTournament,topAssists:e.target.value}}))} placeholder="מלך הבישולים שלי" style={{marginTop:10}}/><button className="primary" style={{marginTop:12}} onClick={()=>notify('הפרופיל נשמר')}>שמור פרופיל</button></section>}

    {tab === 'admin' && <section>
      <div className="card admin"><h2>🔧 ניהול מערכת</h2>{!admin?<button className="primary" onClick={()=>{const p=prompt('סיסמת מנהל'); if(p===ADMIN_PASSWORD){setAdmin(true);notify('נכנסת כמנהל')} else if(p) notify('סיסמה שגויה')}}>כניסת מנהל</button>:<><button className="ghost" onClick={addUser}><Plus size={16}/> הוסף משתתף</button><button className="ghost" style={{marginInlineStart:8}} onClick={()=>setAdmin(false)}><LogOut size={16}/> יציאה</button><button className="ghost danger" style={{marginTop:10}} onClick={resetAll}><Trash2 size={16}/> איפוס מלא</button></>}</div>
      {admin && fixtures[matchday]?.map(g=>{const k=gameKey(matchday,g.id); const a=actualScores[k]||{homeScore:0,awayScore:0,isFinished:false,winner:'X'};return <div className="card admin" key={g.id}><b>{g.home} - {g.away}</b><div className="score" style={{marginTop:12}}><div className="counter"><button onClick={()=>adminScore(g.id,{awayScore:Math.max(0,a.awayScore-1)})}>−</button><span>{a.awayScore}</span><button onClick={()=>adminScore(g.id,{awayScore:a.awayScore+1})}>+</button></div><b>:</b><div className="counter"><button onClick={()=>adminScore(g.id,{homeScore:Math.max(0,a.homeScore-1)})}>−</button><span>{a.homeScore}</span><button onClick={()=>adminScore(g.id,{homeScore:a.homeScore+1})}>+</button></div></div><button className="primary" style={{marginTop:12}} onClick={()=>adminScore(g.id,{isFinished:!a.isFinished})}>{a.isFinished?'פתח משחק':'סגור משחק וחישוב ניקוד'}</button></div>})}
    </section>}

    <section className="card"><h3><Info size={18}/> חשוב</h3><p className="muted small">בגרסה v6 הנתונים נשמרים ב־localStorage של המכשיר. כלומר רענון לא מוחק, אבל טלפון אחר לא יראה אותם. לחיבור בין כל החברים נחבר Firebase בשלב הבא.</p></section>
    {toast && <div className="toast">{toast}</div>}
  </div></div>;
}
