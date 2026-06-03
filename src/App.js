import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const WORKOUTS = [
  { id: "weight",    label: "重訓",   icon: "💪", color: "#8B5E3C" },
  { id: "class",     label: "團課",   icon: "🕺", color: "#6B4F3A" },
  { id: "run_out",   label: "室外跑", icon: "🏃", color: "#7A5C44" },
  { id: "run_in",    label: "室內跑", icon: "🏟", color: "#6B5040" },
  { id: "slow_run",  label: "超慢跑", icon: "🐢", color: "#9C7A55" },
  { id: "bike",      label: "公路車", icon: "🚴", color: "#A07850" },
  { id: "badminton", label: "羽球",   icon: "🏸", color: "#9C6B3C" },
  { id: "yoga",      label: "瑜珈",   icon: "🧘", color: "#B8845A" },
  { id: "swim",      label: "游泳",   icon: "🏊", color: "#7A6044" },
  { id: "other",     label: "其他",   icon: "⚡", color: "#C8956C" },
];

const DURATIONS = [15, 30, 45, 60, 75, 90, 120];
const TABS = ["今日打卡", "日曆紀錄"];
const WEEK_LABELS = ["日","一","二","三","四","五","六"];
const MONTH_NAMES = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function formatDateLabel(s) { const [,m,d]=s.split("-"); return `${m}/${d}`; }
function getDaysInMonth(y,m) { return new Date(y,m+1,0).getDate(); }
function getFirstDayOfMonth(y,m) { return new Date(y,m,1).getDay(); }

// ─── Auth Screen ────────────────────────────────────────────────
function AuthScreen() {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!email || !password) { setError("請填入 Email 和密碼"); return; }
    if (mode === "signup" && !name) { setError("請填入你的名字"); return; }
    if (password.length < 6) { setError("密碼至少 6 個字元"); return; }
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Email 或密碼錯誤，請再試一次");
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      });
      if (error) setError(error.message);
      else setSuccess("註冊成功！請查看 Email 確認信，確認後即可登入 📬");
    }
    setLoading(false);
  };

  const inputStyle = {
    width:"100%", padding:"14px 16px", borderRadius:14,
    border:"1.5px solid #D4C0A8", background:"#FBF7F2",
    color:"#3E2A1A", fontSize:15, fontFamily:"'Noto Sans TC',sans-serif",
    outline:"none", marginBottom:12,
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F5EFE6", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", fontFamily:"'Playfair Display','Noto Sans TC',serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Noto+Sans+TC:wght@400;500;700&display=swap'); * { box-sizing:border-box; }`}</style>
      <div style={{ fontSize:56, marginBottom:16 }}>🍵</div>
      <h1 style={{ fontSize:30, fontWeight:900, color:"#3E2A1A", textAlign:"center", lineHeight:1.2, marginBottom:6, fontFamily:"'Playfair Display',serif" }}>運動好習慣</h1>
      <p style={{ fontSize:14, color:"#9C7E6A", fontFamily:"'Noto Sans TC',sans-serif", marginBottom:32, textAlign:"center" }}>週打卡紀錄 · 每天一點點</p>

      <div style={{ width:"100%", maxWidth:360, background:"#EDE0D0", borderRadius:24, padding:"28px 24px", border:"1px solid #D4C0A8", boxShadow:"0 4px 24px #8B5E3C14" }}>
        {/* Tab */}
        <div style={{ display:"flex", background:"#D4C0A8", borderRadius:12, padding:3, marginBottom:24, gap:0 }}>
          {["login","signup"].map((m,i) => (
            <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }} style={{
              flex:1, padding:"9px 0", borderRadius:10, border:"none", cursor:"pointer",
              background: mode===m ? "#8B5E3C" : "transparent",
              color: mode===m ? "#F5EFE6" : "#9C7E6A",
              fontWeight: mode===m ? 700 : 400, fontSize:14,
              fontFamily:"'Noto Sans TC',sans-serif", transition:"all 0.2s",
            }}>{i===0 ? "登入" : "註冊"}</button>
          ))}
        </div>

        {mode === "signup" && (
          <input
            placeholder="你的名字"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
        )}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="密碼（至少 6 個字元）"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ ...inputStyle, marginBottom:16 }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />

        {error && <div style={{ color:"#C0392B", fontSize:13, fontFamily:"'Noto Sans TC',sans-serif", marginBottom:12, textAlign:"center" }}>{error}</div>}
        {success && <div style={{ color:"#27AE60", fontSize:13, fontFamily:"'Noto Sans TC',sans-serif", marginBottom:12, textAlign:"center", lineHeight:1.6 }}>{success}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{
          width:"100%", padding:"15px", borderRadius:14,
          background:"linear-gradient(90deg,#8B5E3C,#C8956C)",
          color:"#F5EFE6", border:"none", cursor:"pointer",
          fontSize:16, fontWeight:700, fontFamily:"'Noto Sans TC',sans-serif",
          boxShadow:"0 4px 18px #8B5E3C44", transition:"all 0.2s",
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "處理中…" : mode === "login" ? "登入" : "註冊帳號"}
        </button>
      </div>

      <p style={{ marginTop:24, fontSize:12, color:"#B89C82", fontFamily:"'Noto Sans TC',sans-serif", textAlign:"center", maxWidth:280, lineHeight:1.7 }}>
        每個帳號有獨立的打卡紀錄<br/>可與家人分別使用 😊
      </p>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logs, setLogs] = useState({});
  const [dataLoading, setDataLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const openModal = (date) => { setModalDate(date); setShowModal(true); setSelectedWorkout(null); setCustomDuration(""); setSelectedDuration(45); };
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(45);
  const [customDuration, setCustomDuration] = useState("");

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const today = todayStr();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session); setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    const fetchLogs = async () => {
      setDataLoading(true);
      const { data, error } = await supabase
        .from("workout_logs").select("*")
        .eq("user_id", session.user.id)
        .order("date", { ascending: true });
      if (!error && data) {
        const grouped = {};
        data.forEach(row => {
          if (!grouped[row.date]) grouped[row.date] = [];
          grouped[row.date].push({ dbId:row.id, id:row.workout_id, label:row.label, icon:row.icon, color:row.color, duration:row.duration, ts:row.created_at });
        });
        setLogs(grouped);
      }
      setDataLoading(false);
    };
    fetchLogs();
  }, [session]);

  const todayLogs = logs[today] || [];
  const totalWorkouts = Object.values(logs).flat().length;
  const totalMinutes = Object.values(logs).flat().reduce((s,e) => s+(e.duration||0), 0);
  const activeDays = Object.keys(logs).length;

  const handleCheckIn = async () => {
    if (!selectedWorkout || !session) return;
    const dur = customDuration ? parseInt(customDuration) : selectedDuration;
    const targetDate = modalDate || today;
    const { data, error } = await supabase.from("workout_logs").insert({
      user_id: session.user.id, date: targetDate,
      workout_id: selectedWorkout.id, label: selectedWorkout.label,
      icon: selectedWorkout.icon, color: selectedWorkout.color, duration: dur,
    }).select().single();
    if (!error && data) {
      const entry = { dbId:data.id, ...selectedWorkout, duration:dur, ts:data.created_at };
      const targetDate = modalDate || today;
      setLogs({ ...logs, [targetDate]: [...(logs[targetDate]||[]), entry] });
      setShowModal(false); setSelectedWorkout(null); setCustomDuration("");
      setCelebrate(true); setTimeout(() => setCelebrate(false), 2500);
    }
  };

  const removeLog = async (dateStr, idx) => {
    const entry = (logs[dateStr]||[])[idx];
    if (!entry) return;
    await supabase.from("workout_logs").delete().eq("id", entry.dbId);
    const newDay = (logs[dateStr]||[]).filter((_,i) => i!==idx);
    const newLogs = { ...logs, [dateStr]: newDay };
    if (newDay.length===0) delete newLogs[dateStr];
    setLogs(newLogs);
  };

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const calDays = [];
  for (let i=0;i<firstDay;i++) calDays.push(null);
  for (let d=1;d<=daysInMonth;d++) calDays.push(d);
  function calDateStr(d) { return `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

  const userName = session?.user?.user_metadata?.full_name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "你";

  if (authLoading) return (
    <div style={{ minHeight:"100vh", background:"#F5EFE6", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:40 }}>🍵</div>
      <div style={{ color:"#9C7E6A", fontSize:14, fontFamily:"sans-serif" }}>載入中…</div>
    </div>
  );

  if (!session) return <AuthScreen />;

  if (dataLoading) return (
    <div style={{ minHeight:"100vh", background:"#F5EFE6", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:40 }}>🍵</div>
      <div style={{ color:"#9C7E6A", fontSize:14, fontFamily:"sans-serif" }}>載入紀錄中…</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#F5EFE6", fontFamily:"'Playfair Display','Noto Sans TC',Georgia,serif", color:"#3E2A1A", maxWidth:480, margin:"0 auto", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Noto+Sans+TC:wght@400;500;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { display:none; }
        @keyframes pop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
        @keyframes confetti { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(150px) rotate(720deg);opacity:0} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        .wo-btn:active { transform:scale(0.94) !important; }
        input::-webkit-inner-spin-button { -webkit-appearance:none; }
      `}</style>

      {celebrate && (
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1000 }}>
          {[...Array(22)].map((_,i)=>(
            <div key={i} style={{ position:"absolute", left:`${Math.random()*100}%`, top:"-20px", fontSize:22, animation:`confetti ${1.2+Math.random()}s ease-in ${Math.random()*0.4}s forwards` }}>
              {["🎉","⭐","🍵","💪","🏆","✨","🔥"][Math.floor(Math.random()*7)]}
            </div>
          ))}
          <div style={{ position:"absolute", top:"42%", left:"50%", transform:"translate(-50%,-50%)", background:"#6B4F3A", color:"#F5EFE6", fontWeight:700, fontSize:24, padding:"20px 36px", borderRadius:22, animation:"pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards", textAlign:"center", boxShadow:"0 8px 40px #6B4F3A55", fontFamily:"'Playfair Display',serif" }}>
            打卡成功！💪<br/><span style={{ fontSize:14, fontWeight:400, fontFamily:"'Noto Sans TC',sans-serif" }}>繼續保持！</span>
          </div>
        </div>
      )}

      {showModal && (
        <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          <div style={{ position:"absolute", inset:0, background:"#3E2A1A55", backdropFilter:"blur(4px)" }} onClick={()=>setShowModal(false)}/>
          <div style={{ position:"relative", background:"#F5EFE6", borderRadius:"28px 28px 0 0", padding:"28px 24px 48px", animation:"slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1)" }}>
            <div style={{ width:40, height:4, background:"#D4C0A8", borderRadius:99, margin:"0 auto 24px" }}/>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, marginBottom:6 }}>{modalDate === today ? "今天做了什麼？" : "補登運動紀錄 📝"}</div>
            <div style={{ fontSize:12, color:"#9C7E6A", fontFamily:"'Noto Sans TC',sans-serif", marginBottom:20 }}>{formatDateLabel(modalDate || today)} · 選擇運動類型</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
              {WORKOUTS.map(w=>(
                <button key={w.id} className="wo-btn" onClick={()=>setSelectedWorkout(w)} style={{
                  background: selectedWorkout?.id===w.id ? w.color : "#EDE0D0",
                  border:`2px solid ${selectedWorkout?.id===w.id ? w.color : "#D4C0A8"}`,
                  borderRadius:16, padding:"12px 6px", cursor:"pointer",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:5,
                  transition:"all 0.18s cubic-bezier(0.34,1.2,0.64,1)",
                  transform: selectedWorkout?.id===w.id ? "scale(1.06)" : "scale(1)",
                  boxShadow: selectedWorkout?.id===w.id ? `0 4px 14px ${w.color}55` : "none",
                }}>
                  <span style={{ fontSize:22 }}>{w.icon}</span>
                  <span style={{ fontSize:11, fontFamily:"'Noto Sans TC',sans-serif", fontWeight:600, color: selectedWorkout?.id===w.id ? "#F5EFE6" : "#6B4F3A" }}>{w.label}</span>
                </button>
              ))}
            </div>
            <div style={{ fontSize:13, color:"#9C7E6A", fontFamily:"'Noto Sans TC',sans-serif", marginBottom:10, letterSpacing:1 }}>運動時間（分鐘）</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
              {DURATIONS.map(d=>(
                <button key={d} className="wo-btn" onClick={()=>{setSelectedDuration(d);setCustomDuration("");}} style={{
                  background: selectedDuration===d&&!customDuration ? "#8B5E3C" : "#EDE0D0",
                  border:`2px solid ${selectedDuration===d&&!customDuration ? "#8B5E3C" : "#D4C0A8"}`,
                  color: selectedDuration===d&&!customDuration ? "#F5EFE6" : "#6B4F3A",
                  borderRadius:12, padding:"8px 14px", cursor:"pointer",
                  fontSize:13, fontFamily:"'Noto Sans TC',sans-serif", fontWeight:600, transition:"all 0.15s",
                }}>{d}</button>
              ))}
              <input type="number" placeholder="自訂" value={customDuration} onChange={e=>setCustomDuration(e.target.value)} style={{
                width:60, padding:"8px 10px", borderRadius:12,
                border:`2px solid ${customDuration ? "#8B5E3C" : "#D4C0A8"}`,
                background:"#F5EFE6", color:"#3E2A1A", fontSize:13,
                fontFamily:"'Noto Sans TC',sans-serif", outline:"none", textAlign:"center",
              }}/>
            </div>
            <button className="wo-btn" onClick={handleCheckIn} disabled={!selectedWorkout} style={{
              width:"100%", padding:"16px", borderRadius:18,
              background: selectedWorkout ? "linear-gradient(90deg,#8B5E3C,#C8956C)" : "#D4C0A8",
              color: selectedWorkout ? "#F5EFE6" : "#B89C82",
              border:"none", cursor: selectedWorkout ? "pointer" : "default",
              fontSize:16, fontWeight:700, fontFamily:"'Noto Sans TC',sans-serif",
              boxShadow: selectedWorkout ? "0 4px 18px #8B5E3C44" : "none", transition:"all 0.2s",
            }}>
              {selectedWorkout ? `✓ 打卡 ${selectedWorkout.icon} ${selectedWorkout.label}` : "請先選擇運動"}
            </button>
          </div>
        </div>
      )}

      <div style={{ position:"fixed", top:-80, right:-80, width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle,#C8956C22,transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ padding:"28px 20px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={{ fontSize:11, letterSpacing:4, color:"#9C7E6A", textTransform:"uppercase", fontFamily:"'Noto Sans TC',sans-serif" }}>你的教練 · 週訓計畫</div>
          <button onClick={()=>supabase.auth.signOut()} style={{ background:"#EDE0D0", border:"none", color:"#9C7E6A", borderRadius:10, padding:"6px 12px", cursor:"pointer", fontSize:11, fontFamily:"'Noto Sans TC',sans-serif" }}>登出</button>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <h1 style={{ fontSize:28, fontWeight:900, lineHeight:1.15, fontFamily:"'Playfair Display',serif" }}>
            {userName} 的運動紀錄<br/>
            <span style={{ background:"linear-gradient(90deg,#8B5E3C,#C8956C,#A07850,#8B5E3C)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmer 4s linear infinite" }}>週打卡紀錄</span>
          </h1>
          <div style={{ textAlign:"right", fontFamily:"'Noto Sans TC',sans-serif", paddingTop:4 }}>
            <div style={{ fontSize:20 }}>🔥</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#8B5E3C" }}>{activeDays} 天</div>
            <div style={{ fontSize:10, color:"#9C7E6A" }}>累積打卡</div>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", margin:"18px 20px 0", background:"#EDE0D0", borderRadius:16, padding:4, border:"1px solid #D4C0A8" }}>
        {TABS.map((t,i)=>(
          <button key={i} onClick={()=>setTab(i)} style={{
            flex:1, padding:"10px 0", borderRadius:12, border:"none", cursor:"pointer",
            background: tab===i ? "#8B5E3C" : "transparent",
            color: tab===i ? "#F5EFE6" : "#9C7E6A",
            fontWeight: tab===i ? 700 : 400, fontSize:14,
            fontFamily:"'Noto Sans TC',sans-serif", transition:"all 0.2s",
            boxShadow: tab===i ? "0 2px 8px #8B5E3C44" : "none",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding:"20px 20px 80px" }}>
        {tab===0 && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <div style={{ display:"flex", gap:10, marginBottom:20 }}>
              {[
                { label:"總打卡次數", value:`${totalWorkouts}`, icon:"🏅" },
                { label:"活躍天數", value:`${activeDays} 天`, icon:"📅" },
                { label:"運動時數", value:`${Math.floor(totalMinutes/60)}h${totalMinutes%60}m`, icon:"⏱" },
              ].map((s,i)=>(
                <div key={i} style={{ flex:1, background:"#EDE0D0", borderRadius:16, padding:"12px 6px", textAlign:"center", border:"1px solid #D4C0A8" }}>
                  <div style={{ fontSize:18 }}>{s.icon}</div>
                  <div style={{ fontSize:15, fontWeight:700, marginTop:3, color:"#3E2A1A", fontFamily:"'Playfair Display',serif" }}>{s.value}</div>
                  <div style={{ fontSize:10, color:"#9C7E6A", marginTop:2, fontFamily:"'Noto Sans TC',sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize:11, letterSpacing:3, color:"#9C7E6A", textTransform:"uppercase", marginBottom:12, fontFamily:"'Noto Sans TC',sans-serif" }}>今天的運動 · {formatDateLabel(today)}</div>

            {todayLogs.length===0 ? (
              <div style={{ background:"#EDE0D0", borderRadius:20, padding:"32px 20px", textAlign:"center", border:"1.5px dashed #D4C0A8", marginBottom:16 }}>
                <div style={{ fontSize:40, marginBottom:10 }}>🍵</div>
                <div style={{ fontSize:15, color:"#9C7E6A", fontFamily:"'Noto Sans TC',sans-serif" }}>今天還沒運動</div>
                <div style={{ fontSize:12, color:"#B89C82", marginTop:6, fontFamily:"'Noto Sans TC',sans-serif" }}>點下方按鈕開始打卡！</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
                {todayLogs.map((e,i)=>(
                  <div key={i} style={{ background:"linear-gradient(135deg,#D4B896,#C8A882)", borderRadius:18, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, boxShadow:"0 3px 14px #8B5E3C18" }}>
                    <div style={{ width:46, height:46, borderRadius:14, background:e.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{e.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:15, color:"#2A1A0A", fontFamily:"'Noto Sans TC',sans-serif" }}>{e.label}</div>
                      <div style={{ fontSize:12, color:"#5C3A22", marginTop:2, fontFamily:"'Noto Sans TC',sans-serif" }}>⏱ {e.duration} 分鐘</div>
                    </div>
                    <button onClick={()=>removeLog(today,i)} style={{ background:"#C8A882", border:"none", color:"#8B5E3C", width:30, height:30, borderRadius:9, cursor:"pointer", fontSize:14 }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <button className="wo-btn" onClick={()=>openModal(today)} style={{
              width:"100%", padding:"18px", borderRadius:20,
              background:"linear-gradient(90deg,#8B5E3C,#C8956C)",
              color:"#F5EFE6", border:"none", cursor:"pointer",
              fontSize:17, fontWeight:700, fontFamily:"'Noto Sans TC',sans-serif",
              boxShadow:"0 6px 24px #8B5E3C44", transition:"all 0.2s",
            }}>＋ 新增今日運動</button>

            <div style={{ marginTop:18, padding:"16px 20px", borderRadius:20, background:"linear-gradient(135deg,#EDE0D0,#E4D4C0)", border:"1px solid #D4C0A8" }}>
              <div style={{ fontSize:10, color:"#A07850", letterSpacing:3, textTransform:"uppercase", marginBottom:8, fontFamily:"'Noto Sans TC',sans-serif" }}>教練提醒 🍵</div>
              <div style={{ fontSize:13, color:"#6B4F3A", lineHeight:1.8, fontFamily:"'Noto Sans TC',sans-serif" }}>
                {todayLogs.length===0 && "今天任何運動都算！哪怕只是散步 30 分鐘 🚶"}
                {todayLogs.length===1 && "第一個打卡了！身體活動起來了 🔥"}
                {todayLogs.length>=2 && "今天超拚！注意給身體足夠的恢復時間 💆"}
              </div>
            </div>
          </div>
        )}

        {tab===1 && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <div style={{ display:"flex", gap:10, marginBottom:20 }}>
              {[
                { label:"本月打卡", value:`${Object.keys(logs).filter(k=>k.startsWith(`${calYear}-${String(calMonth+1).padStart(2,"0")}`)).length} 天`, icon:"📆" },
                { label:"總運動時", value:`${Math.floor(totalMinutes/60)}h${totalMinutes%60}m`, icon:"⏱" },
                { label:"累積天數", value:`${activeDays} 天`, icon:"🔥" },
              ].map((s,i)=>(
                <div key={i} style={{ flex:1, background:"#EDE0D0", borderRadius:16, padding:"12px 6px", textAlign:"center", border:"1px solid #D4C0A8" }}>
                  <div style={{ fontSize:18 }}>{s.icon}</div>
                  <div style={{ fontSize:15, fontWeight:700, marginTop:3, color:"#3E2A1A", fontFamily:"'Playfair Display',serif" }}>{s.value}</div>
                  <div style={{ fontSize:10, color:"#9C7E6A", marginTop:2, fontFamily:"'Noto Sans TC',sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background:"#EDE0D0", borderRadius:24, padding:"20px 16px", border:"1px solid #D4C0A8", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                <button onClick={()=>{let m=calMonth-1,y=calYear;if(m<0){m=11;y--;}setCalMonth(m);setCalYear(y);setSelectedDay(null);}} style={{ background:"#D4C0A8", border:"none", color:"#6B4F3A", width:34, height:34, borderRadius:10, cursor:"pointer", fontSize:16 }}>‹</button>
                <div style={{ fontWeight:700, fontSize:17, fontFamily:"'Playfair Display',serif" }}>{calYear} · {MONTH_NAMES[calMonth]}</div>
                <button onClick={()=>{let m=calMonth+1,y=calYear;if(m>11){m=0;y++;}setCalMonth(m);setCalYear(y);setSelectedDay(null);}} style={{ background:"#D4C0A8", border:"none", color:"#6B4F3A", width:34, height:34, borderRadius:10, cursor:"pointer", fontSize:16 }}>›</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:8 }}>
                {WEEK_LABELS.map(l=>(<div key={l} style={{ textAlign:"center", fontSize:11, color:"#B89C82", fontFamily:"'Noto Sans TC',sans-serif", padding:"4px 0" }}>{l}</div>))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
                {calDays.map((d,i)=>{
                  if (!d) return <div key={i}/>;
                  const ds=calDateStr(d);
                  const dayLogs=logs[ds]||[];
                  const hasLog=dayLogs.length>0;
                  const isToday=ds===today;
                  const isSelected=selectedDay===ds;
                  const topColor=hasLog?dayLogs[0].color:null;
                  return (
                    <button key={i} onClick={()=>setSelectedDay(isSelected?null:ds)} style={{
                      aspectRatio:"1", borderRadius:12,
                      background: isSelected?"#8B5E3C":hasLog?`${topColor}33`:"transparent",
                      border:`1.5px solid ${isSelected?"#8B5E3C":isToday?"#C8956C":hasLog?`${topColor}66`:"transparent"}`,
                      cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1, transition:"all 0.15s",
                    }}>
                      <span style={{ fontSize:13, fontWeight:isToday||hasLog?700:400, color:isSelected?"#F5EFE6":isToday?"#8B5E3C":hasLog?"#3E2A1A":"#B89C82", fontFamily:"'Noto Sans TC',sans-serif" }}>{d}</span>
                      {hasLog&&(<div style={{ display:"flex", gap:2 }}>{dayLogs.slice(0,3).map((e,ei)=>(<div key={ei} style={{ width:5, height:5, borderRadius:"50%", background:isSelected?"#F5EFE680":e.color }}/>))}</div>)}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDay&&(
              <div style={{ animation:"slideUp 0.25s ease" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontSize:13, color:"#9C7E6A", fontFamily:"'Noto Sans TC',sans-serif", letterSpacing:1 }}>{formatDateLabel(selectedDay)} 的運動紀錄</div>
                  <button className="wo-btn" onClick={()=>openModal(selectedDay)} style={{ background:"linear-gradient(90deg,#8B5E3C,#C8956C)", border:"none", color:"#F5EFE6", borderRadius:12, padding:"8px 14px", cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'Noto Sans TC',sans-serif", boxShadow:"0 2px 10px #8B5E3C33" }}>＋ 補登運動</button>
                </div>
                {(logs[selectedDay]||[]).length===0?(
                  <div style={{ background:"#EDE0D0", borderRadius:16, padding:"20px", textAlign:"center", color:"#B89C82", fontFamily:"'Noto Sans TC',sans-serif", fontSize:13 }}>這天沒有運動紀錄，點上方補登！</div>
                ):(
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {(logs[selectedDay]||[]).map((e,i)=>(
                      <div key={i} style={{ background:"#EDE0D0", borderRadius:16, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, border:"1px solid #D4C0A8" }}>
                        <div style={{ width:40, height:40, borderRadius:12, background:e.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{e.icon}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:14, color:"#3E2A1A", fontFamily:"'Noto Sans TC',sans-serif" }}>{e.label}</div>
                          <div style={{ fontSize:12, color:"#9C7E6A", marginTop:2, fontFamily:"'Noto Sans TC',sans-serif" }}>⏱ {e.duration} 分鐘</div>
                        </div>
                        <button onClick={()=>removeLog(selectedDay,i)} style={{ background:"#D4C0A8", border:"none", color:"#8B5E3C", width:28, height:28, borderRadius:8, cursor:"pointer", fontSize:12 }}>✕</button>
                      </div>
                    ))}
                    <div style={{ textAlign:"right", fontSize:12, color:"#9C7E6A", fontFamily:"'Noto Sans TC',sans-serif", marginTop:4 }}>
                      共 {(logs[selectedDay]||[]).reduce((s,e)=>s+e.duration,0)} 分鐘
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
