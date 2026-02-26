import { useState, useEffect } from "react";

const API_URL = "https://baseballiq-production.up.railway.app";

// ─── FALLBACK MOCK DATA ───────────────────────────────────────────────────────
const mockProps = [
  { id:1, player_name:"Aaron Judge", team:"NYY", opponent:"BOS", prop_type:"Home Run", line:"Over 0.5 HR", confidence:87, edge:0.142, edge_str:"+14.2%", over_odds:"+320", implied_prob:"23.8%", model_prob:"38.0%", game:"NYY @ BOS", venue:"Fenway Park", lineup_pos:3, pitcher:"Brayan Bello", weather_summary:{temp:82,wind:"OUT 14mph — Favorable",carry:"+6ft",signal:"positive"}, hitter_statcast:{exit_velo_avg:95.1,barrel_pct:"22.4%",hard_hit_pct:"54.2%"}, category_scores:{hitter:84,pitcher:71,park:55,weather:88,situational:72},
    hitter:{exitVeloAvg:"95.1 mph",exitVeloMax:"118.4 mph",barrelPct:"22.4%",hardHitPct:"54.2%",launchAngle:"17.8°",flyBallRate:"42.1%",pullRate:"44.3%",platoonSplit:"vs RHP: .295/.410/.620",xSLG:".680",xwOBA:".430",rolling10:"4 HRs last 10G",barrelLast30:"21.8% (14-day)",signal:"positive"},
    pitcher_detail:{name:"Brayan Bello",hand:"RHP",hr9:"1.42",recentHr9:"1.81 (L5)",fbRate:"38.4%",gbRate:"41.2%",barrelPctAllowed:"9.1%",hardContactPct:"37.8%",pitchMix:"Sinker 34% · Slider 28% · CH 20%",velocity:"93.4 mph avg",matchup:"Slider-heavy vs RHH — Judge hits .310 vs sliders",handedness:"RHP vs RHH",signal:"positive"},
    park:{name:"Fenway Park",hrFactor:"1.09",altitude:"19 ft",dimensions:"LF 310ft · CF 420ft · RF 302ft",hrFriendly:"Moderate — short RF porch",signal:"neutral"},
    weather:{temp:"82°F",windSpeed:"14 mph",windDir:"OUT to RF (favorable)",humidity:"51%",airDensity:"Low — ball carries 4–6ft farther",signal:"positive"},
    situational:{lineupPos:"3rd",projPA:"4.2 PAs",bullpen:"BOS pen ERA 4.81 (weak)",gameTotal:"8.5",impliedTeamTotal:"NYY: 4.8 runs",trend:"HR in 3 of last 5 · 8-game hit streak",signal:"positive"} },
  { id:2, player_name:"Yordan Alvarez", team:"HOU", opponent:"TEX", prop_type:"Home Run", line:"Over 0.5 HR", confidence:82, edge:0.115, edge_str:"+11.5%", over_odds:"+290", implied_prob:"25.6%", model_prob:"37.1%", game:"HOU @ TEX", venue:"Globe Life Field", lineup_pos:4, pitcher:"Nathan Eovaldi", weather_summary:{temp:91,wind:"OUT 11mph — Favorable",carry:"+8ft",signal:"positive"}, hitter_statcast:{exit_velo_avg:96.3,barrel_pct:"19.8%",hard_hit_pct:"57.1%"}, category_scores:{hitter:82,pitcher:68,park:72,weather:90,situational:70},
    hitter:{exitVeloAvg:"96.3 mph",exitVeloMax:"116.2 mph",barrelPct:"19.8%",hardHitPct:"57.1%",launchAngle:"19.2°",flyBallRate:"44.8%",pullRate:"38.2%",platoonSplit:"vs RHP: .310/.430/.660",xSLG:".710",xwOBA:".448",rolling10:"3 HRs last 10G",barrelLast30:"20.3% (14-day)",signal:"positive"},
    pitcher_detail:{name:"Nathan Eovaldi",hand:"RHP",hr9:"1.28",recentHr9:"1.54 (L5)",fbRate:"40.1%",gbRate:"38.7%",barrelPctAllowed:"10.2%",hardContactPct:"40.1%",pitchMix:"4-Seam 38% · Splitter 28% · Slider 22%",velocity:"95.1 mph avg",matchup:"High slider usage to LHH — Alvarez .340 vs sliders",handedness:"RHP vs LHH",signal:"positive"},
    park:{name:"Globe Life Field",hrFactor:"1.13",altitude:"551 ft",dimensions:"LF 329ft · CF 407ft · RF 326ft",hrFriendly:"HR-friendly — elevated altitude & short corners",signal:"positive"},
    weather:{temp:"91°F",windSpeed:"11 mph",windDir:"OUT to LF (favorable)",humidity:"44%",airDensity:"Low — extreme heat reduces density",signal:"positive"},
    situational:{lineupPos:"4th",projPA:"4.1 PAs",bullpen:"TEX pen ERA 4.22",gameTotal:"9.0",impliedTeamTotal:"HOU: 4.7 runs",trend:"2 HRs in last 7 days",signal:"positive"} },
  { id:3, player_name:"Freddie Freeman", team:"LAD", opponent:"SD", prop_type:"Hit", line:"Over 1.5 Hits", confidence:78, edge:0.098, edge_str:"+9.8%", over_odds:"+175", implied_prob:"36.4%", model_prob:"46.2%", game:"LAD @ SD", venue:"Petco Park", lineup_pos:3, pitcher:"Yu Darvish", weather_summary:{temp:74,wind:"Crosswind 6mph — Neutral",carry:"-2ft",signal:"neutral"}, hitter_statcast:{exit_velo_avg:91.4,barrel_pct:"14.2%",hard_hit_pct:"44.1%"}, category_scores:{hitter:80,pitcher:74,park:42,weather:48,situational:76},
    hitter:{exitVeloAvg:"91.4 mph",exitVeloMax:"110.8 mph",barrelPct:"14.2%",hardHitPct:"44.1%",launchAngle:"13.1°",flyBallRate:"32.4%",pullRate:"36.8%",platoonSplit:"vs RHP: .320/.420/.560",xSLG:".580",xwOBA:".412",rolling10:"12 hits last 10G",barrelLast30:"13.8% (14-day)",signal:"positive"},
    pitcher_detail:{name:"Yu Darvish",hand:"RHP",hr9:"0.88",recentHr9:"0.71 (L5)",fbRate:"31.2%",gbRate:"44.8%",barrelPctAllowed:"6.9%",hardContactPct:"29.4%",pitchMix:"Slider 30% · Cutter 25% · Splitter 20%",velocity:"91.8 mph avg",matchup:"Curveball-heavy — Freeman hits .390 vs curves",handedness:"RHP vs LHH",signal:"positive"},
    park:{name:"Petco Park",hrFactor:"0.88",altitude:"42 ft",dimensions:"LF 336ft · CF 396ft · RF 322ft",hrFriendly:"HR-suppressing — marine layer",signal:"negative"},
    weather:{temp:"74°F",windSpeed:"6 mph",windDir:"Neutral crosswind",humidity:"72%",airDensity:"High — marine layer present",signal:"negative"},
    situational:{lineupPos:"3rd",projPA:"4.3 PAs",bullpen:"SD pen ERA 3.44 (strong)",gameTotal:"7.0",impliedTeamTotal:"LAD: 3.9 runs",trend:"8 straight games with a hit",signal:"positive"} },
  { id:4, player_name:"Bobby Witt Jr.", team:"KC", opponent:"CLE", prop_type:"Stolen Base", line:"Over 0.5 SB", confidence:74, edge:0.083, edge_str:"+8.3%", over_odds:"+240", implied_prob:"29.4%", model_prob:"37.7%", game:"KC @ CLE", venue:"Progressive Field", lineup_pos:1, pitcher:"Shane Bieber", weather_summary:{temp:68,wind:"IN 8mph — Slight suppression",carry:"-1ft",signal:"neutral"}, hitter_statcast:{exit_velo_avg:89.7,barrel_pct:"12.1%",hard_hit_pct:"39.4%"}, category_scores:{hitter:60,pitcher:65,park:50,weather:50,situational:80},
    hitter:{exitVeloAvg:"89.7 mph",exitVeloMax:"108.4 mph",barrelPct:"12.1%",hardHitPct:"39.4%",launchAngle:"9.8°",flyBallRate:"26.1%",pullRate:"35.2%",platoonSplit:"vs RHP: .284/.345/.472",xSLG:".488",xwOBA:".362",rolling10:"8 hits, 3 SB attempts last 10G",barrelLast30:"11.4% (14-day)",signal:"positive"},
    pitcher_detail:{name:"Shane Bieber",hand:"RHP",hr9:"0.91",recentHr9:"0.78 (L5)",fbRate:"36.8%",gbRate:"44.2%",barrelPctAllowed:"7.8%",hardContactPct:"33.1%",pitchMix:"Slider 36% · Curve 24% · 4-Seam 22%",velocity:"91.2 mph avg",matchup:"Slow delivery — easy to time for SB",handedness:"RHP vs RHH",signal:"positive"},
    park:{name:"Progressive Field",hrFactor:"0.96",altitude:"649 ft",dimensions:"LF 325ft · CF 405ft · RF 325ft",hrFriendly:"Slightly suppressing",signal:"neutral"},
    weather:{temp:"68°F",windSpeed:"8 mph",windDir:"IN from LF",humidity:"58%",airDensity:"Normal",signal:"neutral"},
    situational:{lineupPos:"1st",projPA:"4.8 PAs",bullpen:"CLE pen ERA 3.91",gameTotal:"7.5",impliedTeamTotal:"KC: 3.6 runs",trend:"SB attempt in 4 of last 6 games",signal:"positive"} },
  { id:5, player_name:"Jazz Chisholm Jr.", team:"NYY", opponent:"BOS", prop_type:"Strikeout", line:"Over 0.5 K", confidence:72, edge:0.075, edge_str:"+7.5%", over_odds:"-130", implied_prob:"56.5%", model_prob:"64.0%", game:"NYY @ BOS", venue:"Fenway Park", lineup_pos:2, pitcher:"Tanner Houck", weather_summary:{temp:82,wind:"OUT 14mph — No K impact",carry:"+6ft",signal:"neutral"}, hitter_statcast:{exit_velo_avg:91.0,barrel_pct:"14.1%",hard_hit_pct:"43.8%"}, category_scores:{hitter:45,pitcher:82,park:50,weather:50,situational:74},
    hitter:{exitVeloAvg:"91.0 mph",exitVeloMax:"112.4 mph",barrelPct:"14.1%",hardHitPct:"43.8%",launchAngle:"14.2°",flyBallRate:"34.7%",pullRate:"42.1%",platoonSplit:"vs RHP: .241/.318/.451",xSLG:".480",xwOBA:".341",rolling10:"K in 6 of last 8G",barrelLast30:"12.9% (14-day)",signal:"negative"},
    pitcher_detail:{name:"Tanner Houck",hand:"RHP",hr9:"0.74",recentHr9:"0.62 (L5)",fbRate:"38.1%",gbRate:"42.3%",barrelPctAllowed:"6.4%",hardContactPct:"31.2%",pitchMix:"Sinker 35% · Slider 32% · Cutter 22%",velocity:"95.8 mph avg",matchup:"Elite slider — Chisholm K rate 38% vs sliders",handedness:"RHP vs LHH",signal:"positive"},
    park:{name:"Fenway Park",hrFactor:"1.09",altitude:"19 ft",dimensions:"LF 310ft · CF 420ft · RF 302ft",hrFriendly:"Neutral for K props",signal:"neutral"},
    weather:{temp:"82°F",windSpeed:"14 mph",windDir:"OUT to RF — no K impact",humidity:"51%",airDensity:"Normal for K props",signal:"neutral"},
    situational:{lineupPos:"2nd",projPA:"4.4 PAs",bullpen:"BOS pen K/9: 9.4",gameTotal:"8.5",impliedTeamTotal:"NYY: 4.8 runs",trend:"K in 6 of last 8 games",signal:"positive"} },
  { id:6, player_name:"Pete Alonso", team:"NYM", opponent:"ATL", prop_type:"RBI", line:"Over 0.5 RBI", confidence:76, edge:0.089, edge_str:"+8.9%", over_odds:"+130", implied_prob:"43.5%", model_prob:"52.4%", game:"NYM @ ATL", venue:"Truist Park", lineup_pos:4, pitcher:"Charlie Morton", weather_summary:{temp:79,wind:"OUT 10mph — Favorable",carry:"+5ft",signal:"positive"}, hitter_statcast:{exit_velo_avg:94.2,barrel_pct:"18.7%",hard_hit_pct:"52.3%"}, category_scores:{hitter:78,pitcher:70,park:62,weather:76,situational:78},
    hitter:{exitVeloAvg:"94.2 mph",exitVeloMax:"115.7 mph",barrelPct:"18.7%",hardHitPct:"52.3%",launchAngle:"16.8°",flyBallRate:"40.2%",pullRate:"43.1%",platoonSplit:"vs RHP: .282/.388/.580",xSLG:".640",xwOBA:".418",rolling10:"RBI in 5 of last 7G",barrelLast30:"18.1% (14-day)",signal:"positive"},
    pitcher_detail:{name:"Charlie Morton",hand:"RHP",hr9:"1.31",recentHr9:"1.62 (L5)",fbRate:"39.4%",gbRate:"38.8%",barrelPctAllowed:"9.8%",hardContactPct:"38.4%",pitchMix:"Curve 38% · 4-Seam 28% · Slider 22%",velocity:"93.1 mph avg",matchup:"High FB% — Alonso crushes elevated fastballs",handedness:"RHP vs RHH",signal:"positive"},
    park:{name:"Truist Park",hrFactor:"1.06",altitude:"1,050 ft",dimensions:"LF 335ft · CF 400ft · RF 325ft",hrFriendly:"Slightly HR-friendly — altitude helps carry",signal:"positive"},
    weather:{temp:"79°F",windSpeed:"10 mph",windDir:"OUT to CF — favorable",humidity:"62%",airDensity:"Slightly low — altitude effect",signal:"positive"},
    situational:{lineupPos:"4th",projPA:"4.2 PAs",bullpen:"ATL pen ERA 4.44",gameTotal:"8.0",impliedTeamTotal:"NYM: 4.1 runs",trend:"RBI in 5 of last 7 games",signal:"positive"} },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getGrade = (c) => {
  if (c >= 90) return { letter:"A+", color:"#22d3a5", glow:"rgba(34,211,165,0.16)",  desc:"Elite"       };
  if (c >= 85) return { letter:"A",  color:"#34d399", glow:"rgba(52,211,153,0.14)",  desc:"Excellent"   };
  if (c >= 80) return { letter:"A−", color:"#4ade80", glow:"rgba(74,222,128,0.13)",  desc:"Very Strong" };
  if (c >= 75) return { letter:"B+", color:"#a3e635", glow:"rgba(163,230,53,0.13)",  desc:"Strong"      };
  if (c >= 70) return { letter:"B",  color:"#facc15", glow:"rgba(250,204,21,0.13)",  desc:"Good"        };
  if (c >= 65) return { letter:"B−", color:"#fb923c", glow:"rgba(251,146,60,0.13)",  desc:"Moderate"    };
  if (c >= 60) return { letter:"C+", color:"#f97316", glow:"rgba(249,115,22,0.13)",  desc:"Lean"        };
  if (c >= 55) return { letter:"C",  color:"#ef4444", glow:"rgba(239,68,68,0.13)",   desc:"Weak"        };
  return              { letter:"D",  color:"#64748b", glow:"rgba(100,116,139,0.10)", desc:"Avoid"       };
};

const propMeta = {
  "Home Run":    { badge:"HR",  color:"#f87171", bg:"rgba(248,113,113,0.10)", border:"rgba(248,113,113,0.28)", icon:"💣" },
  "Hit":         { badge:"HIT", color:"#4ade80", bg:"rgba(74,222,128,0.10)",  border:"rgba(74,222,128,0.28)",  icon:"🎯" },
  "Stolen Base": { badge:"SB",  color:"#60a5fa", bg:"rgba(96,165,250,0.10)",  border:"rgba(96,165,250,0.28)",  icon:"💨" },
  "Strikeout":   { badge:"K",   color:"#c084fc", bg:"rgba(192,132,252,0.10)", border:"rgba(192,132,252,0.28)", icon:"🌀" },
  "RBI":         { badge:"RBI", color:"#fb923c", bg:"rgba(251,146,60,0.10)",  border:"rgba(251,146,60,0.28)",  icon:"🏃" },
};

const navItems = [
  { id:"home",        label:"Home",         icon:"🏠", color:"#22d3a5" },
  { id:"Home Run",    label:"Home Runs",    icon:"💣", color:"#f87171" },
  { id:"Hit",         label:"Hits",         icon:"🎯", color:"#4ade80" },
  { id:"Stolen Base", label:"Stolen Bases", icon:"💨", color:"#60a5fa" },
  { id:"Strikeout",   label:"Strikeouts",   icon:"🌀", color:"#c084fc" },
  { id:"RBI",         label:"RBIs",         icon:"🏃", color:"#fb923c" },
];

const signalColor  = (s) => s==="positive"?"#22d3a5":s==="negative"?"#f87171":"#475569";
const signalBg     = (s) => s==="positive"?"rgba(34,211,165,0.08)":s==="negative"?"rgba(248,113,113,0.08)":"rgba(255,255,255,0.03)";
const signalBorder = (s) => s==="positive"?"rgba(34,211,165,0.2)":s==="negative"?"rgba(248,113,113,0.2)":"rgba(255,255,255,0.06)";
const signalIcon   = (s) => s==="positive"?"▲":s==="negative"?"▼":"●";

const catSignal = (prop, cat) => {
  if (prop[cat] && prop[cat].signal) return prop[cat].signal;
  const score = prop.category_scores && prop.category_scores[cat];
  if (score == null) return "neutral";
  return score >= 65 ? "positive" : score <= 40 ? "negative" : "neutral";
};

// ─── GRADE BADGE ──────────────────────────────────────────────────────────────
function GradeBadge({ confidence, size }) {
  size = size || 68;
  const g = getGrade(confidence);
  return (
    <div style={{ width:size, height:size, borderRadius:size*0.2, flexShrink:0, background:"linear-gradient(145deg,"+g.glow+",rgba(255,255,255,.02))", border:"2px solid "+g.color+"50", boxShadow:"0 0 18px "+g.glow+",inset 0 1px 0 "+g.color+"18", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-8, right:-8, width:32, height:32, borderRadius:"50%", background:g.color+"10", filter:"blur(10px)" }}/>
      <span style={{ fontSize:size*0.36, fontWeight:900, color:g.color, lineHeight:1, fontFamily:"'Barlow Condensed',sans-serif", textShadow:"0 0 12px "+g.color+"80" }}>{g.letter}</span>
      <span style={{ fontSize:size*0.14, color:g.color+"99", fontFamily:"'DM Mono',monospace", marginTop:2 }}>{confidence}%</span>
    </div>
  );
}

// ─── FACTOR ROW ───────────────────────────────────────────────────────────────
function FactorRow({ label, value, signal }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontSize:10, color:"#3d5170", fontFamily:"'DM Mono',monospace", flexShrink:0, marginRight:12 }}>{label}</span>
      <span style={{ fontSize:11, color:signal?signalColor(signal):"#94a3b8", fontFamily:"'DM Mono',monospace", textAlign:"right", lineHeight:1.4 }}>{value||"—"}</span>
    </div>
  );
}

function FactorPanel({ title, icon, data, fields, signal }) {
  if (!data) {
    return <div style={{ padding:20, color:"#3d5170", fontFamily:"'DM Mono',monospace", fontSize:11, textAlign:"center" }}>No detail data available</div>;
  }
  const sc = signalColor(signal);
  return (
    <div style={{ borderRadius:10, overflow:"hidden", border:"1px solid "+signalBorder(signal), background:signalBg(signal) }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"rgba(0,0,0,0.2)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ fontSize:14 }}>{icon}</span>
          <span style={{ fontSize:11, fontWeight:700, color:sc, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:".1em" }}>{title}</span>
        </div>
        <span style={{ fontSize:10, fontWeight:700, color:sc, fontFamily:"'DM Mono',monospace" }}>{signalIcon(signal)} {signal ? signal.toUpperCase() : ""}</span>
      </div>
      <div style={{ padding:"4px 14px 10px" }}>
        {fields.map(function(f) { return <FactorRow key={f.label} label={f.label} value={data[f.key]} signal={f.signal}/>; })}
      </div>
    </div>
  );
}

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <style>{"@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}"}</style>
      {[1,2,3,4].map(function(i) {
        return (
          <div key={i} style={{ height:90, borderRadius:16, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)", animation:"shimmer 1.5s infinite" }}/>
          </div>
        );
      })}
    </div>
  );
}

// ─── DATA BADGE ───────────────────────────────────────────────────────────────
function DataBadge({ isLive }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:6, background:isLive?"rgba(34,211,165,0.1)":"rgba(251,146,60,0.1)", border:"1px solid "+(isLive?"rgba(34,211,165,0.3)":"rgba(251,146,60,0.3)") }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:isLive?"#22d3a5":"#fb923c" }}/>
      <span style={{ fontSize:9, fontWeight:700, color:isLive?"#22d3a5":"#fb923c", fontFamily:"'DM Mono',monospace", letterSpacing:".1em" }}>{isLive?"LIVE DATA":"DEMO DATA"}</span>
    </div>
  );
}

// ─── PROP CARD ────────────────────────────────────────────────────────────────
function PropCard({ prop, rank, expanded, onToggle }) {
  const [activeTab, setActiveTab] = useState("hitter");
  const pc = propMeta[prop.prop_type] || propMeta["Home Run"];
  const g  = getGrade(prop.confidence);

  const tabs = [
    { id:"hitter",        label:"Hitter",    icon:"🏏" },
    { id:"pitcher_detail",label:"Pitcher",   icon:"⚾" },
    { id:"park",          label:"Park",      icon:"🏟️" },
    { id:"weather",       label:"Weather",   icon:"🌤️" },
    { id:"situational",   label:"Situation", icon:"📋" },
  ];

  const hitterFields = [
    {label:"Exit Velo (avg)",       key:"exitVeloAvg",   signal:"positive"},
    {label:"Max Exit Velo",         key:"exitVeloMax",   signal:"positive"},
    {label:"Barrel %",              key:"barrelPct",     signal:"positive"},
    {label:"Hard-Hit % (95+mph)",   key:"hardHitPct",    signal:"positive"},
    {label:"Launch Angle",          key:"launchAngle",   signal:null},
    {label:"Fly-Ball Rate",         key:"flyBallRate",   signal:"positive"},
    {label:"Pull Rate",             key:"pullRate",      signal:"positive"},
    {label:"Platoon Split",         key:"platoonSplit",  signal:null},
    {label:"xSLG",                  key:"xSLG",          signal:"positive"},
    {label:"xwOBA",                 key:"xwOBA",         signal:"positive"},
    {label:"Rolling 10-15G Power",  key:"rolling10",     signal:null},
    {label:"Barrel% (L14-30 days)", key:"barrelLast30",  signal:null},
  ];
  const pitcherFields = [
    {label:"Pitcher",               key:"name",             signal:null},
    {label:"Handedness",            key:"hand",             signal:null},
    {label:"HR/9 (season)",         key:"hr9",              signal:null},
    {label:"HR/9 (recent L5)",      key:"recentHr9",        signal:null},
    {label:"Fly-Ball Rate allowed", key:"fbRate",           signal:null},
    {label:"Ground-Ball Rate",      key:"gbRate",           signal:null},
    {label:"Barrel% allowed",       key:"barrelPctAllowed", signal:null},
    {label:"Hard Contact% allowed", key:"hardContactPct",   signal:null},
    {label:"Pitch Mix",             key:"pitchMix",         signal:null},
    {label:"Pitch Velocity",        key:"velocity",         signal:null},
    {label:"Pitch-Type Matchup",    key:"matchup",          signal:null},
    {label:"Handedness Matchup",    key:"handedness",       signal:null},
  ];
  const parkFields = [
    {label:"Ballpark",    key:"name",       signal:null},
    {label:"HR Factor",   key:"hrFactor",   signal:null},
    {label:"Altitude",    key:"altitude",   signal:null},
    {label:"Dimensions",  key:"dimensions", signal:null},
    {label:"HR Tendency", key:"hrFriendly", signal:null},
  ];
  const weatherFields = [
    {label:"Temperature",    key:"temp",       signal:null},
    {label:"Wind Speed",     key:"windSpeed",  signal:null},
    {label:"Wind Direction", key:"windDir",    signal:null},
    {label:"Humidity",       key:"humidity",   signal:null},
    {label:"Air Density",    key:"airDensity", signal:null},
  ];
  const sitFields = [
    {label:"Lineup Position",          key:"lineupPos",        signal:null},
    {label:"Projected PAs",            key:"projPA",           signal:null},
    {label:"Bullpen (Behind Starter)", key:"bullpen",          signal:null},
    {label:"Game Total (O/U)",         key:"gameTotal",        signal:null},
    {label:"Implied Team Total",       key:"impliedTeamTotal", signal:null},
    {label:"Recent Trend",             key:"trend",            signal:null},
  ];

  const fieldMap = { hitter:hitterFields, pitcher_detail:pitcherFields, park:parkFields, weather:weatherFields, situational:sitFields };

  return (
    <div onClick={onToggle} style={{ background:expanded?"linear-gradient(135deg,rgba(18,26,46,.99),rgba(10,16,32,.99))":"linear-gradient(135deg,rgba(11,18,34,.92),rgba(7,12,24,.92))", border:"1px solid "+(expanded?g.color+"45":"rgba(255,255,255,0.06)"), borderRadius:16, padding:"18px 22px", cursor:"pointer", transition:"all .25s ease", marginBottom:10, boxShadow:expanded?"0 10px 36px rgba(0,0,0,.45),0 0 0 1px "+g.color+"12":"0 2px 10px rgba(0,0,0,.3)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, borderRadius:"16px 0 0 16px", background:"linear-gradient(180deg,"+g.color+","+g.color+"00)" }}/>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:30, height:30, borderRadius:8, flexShrink:0, background:rank<=3?g.glow:"rgba(255,255,255,0.03)", border:"1px solid "+(rank<=3?g.color+"40":"rgba(255,255,255,0.06)"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:rank<=3?g.color:"#2d3f5a", fontFamily:"'Barlow Condensed',sans-serif" }}>{rank}</div>
        <GradeBadge confidence={prop.confidence} size={68}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:20, fontWeight:900, color:"#f1f5f9", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:".02em" }}>{prop.player_name}</span>
            <span style={{ padding:"2px 8px", borderRadius:6, fontSize:10, fontWeight:700, background:pc.bg, border:"1px solid "+pc.border, color:pc.color, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:".1em" }}>{pc.badge}</span>
            <span style={{ fontSize:11, color:"#2d3f5a", fontFamily:"'DM Mono',monospace" }}>{prop.team}</span>
          </div>
          <div style={{ fontSize:12, color:"#3d5170", marginTop:3, fontFamily:"'DM Mono',monospace" }}>{prop.line} · {prop.game}</div>
          {!expanded && (
            <div style={{ display:"flex", gap:5, marginTop:8, flexWrap:"wrap" }}>
              {["hitter","pitcher_detail","park","weather","situational"].map(function(cat) {
                const s = catSignal(prop, cat);
                return (
                  <div key={cat} style={{ display:"flex", alignItems:"center", gap:3, padding:"2px 7px", borderRadius:5, background:signalBg(s), border:"1px solid "+signalBorder(s) }}>
                    <span style={{ fontSize:8, color:signalColor(s) }}>{signalIcon(s)}</span>
                    <span style={{ fontSize:8, color:signalColor(s), fontFamily:"'DM Mono',monospace", letterSpacing:".06em" }}>{cat==="pitcher_detail"?"PTCH":cat.slice(0,4).toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ display:"inline-block", padding:"2px 8px", borderRadius:6, marginBottom:4, background:g.glow, border:"1px solid "+g.color+"35", fontSize:10, fontWeight:700, color:g.color, fontFamily:"'DM Mono',monospace", letterSpacing:".1em" }}>{g.desc.toUpperCase()}</div>
          <div style={{ fontSize:22, fontWeight:900, color:g.color, fontFamily:"'Barlow Condensed',sans-serif", lineHeight:1 }}>{prop.edge_str}</div>
          <div style={{ fontSize:11, color:"#2d3f5a", fontFamily:"'DM Mono',monospace", marginTop:1 }}>edge · {prop.over_odds}</div>
        </div>
        <div style={{ color:"#2d3f5a", fontSize:16, transition:"transform .25s", transform:expanded?"rotate(180deg)":"none", flexShrink:0 }}>▾</div>
      </div>

      {expanded && (
        <div onClick={function(e){e.stopPropagation();}} style={{ marginTop:20, borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", background:"linear-gradient(135deg,"+g.glow+",rgba(255,255,255,.01))", borderRadius:12, border:"1px solid "+g.color+"30", marginBottom:20 }}>
            <div style={{ width:54, height:54, borderRadius:12, background:g.glow, border:"2px solid "+g.color+"55", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:22, fontWeight:900, color:g.color, fontFamily:"'Barlow Condensed',sans-serif", lineHeight:1 }}>{g.letter}</span>
              <span style={{ fontSize:9, color:g.color+"88", fontFamily:"'DM Mono',monospace" }}>{prop.confidence}%</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:g.color, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:".06em" }}>{g.letter} — {g.desc.toUpperCase()} PLAY</div>
              <div style={{ fontSize:11, color:"#3d5170", fontFamily:"'DM Mono',monospace", marginTop:3, lineHeight:1.6 }}>Model: {prop.model_prob} · Book: {prop.implied_prob} · Edge: {prop.edge_str}</div>
            </div>
            <svg width="50" height="50" style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
              <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5"/>
              <circle cx="25" cy="25" r="20" fill="none" stroke={g.color} strokeWidth="5" strokeLinecap="round" strokeDasharray={(prop.confidence/100)*(2*Math.PI*20)+" "+(2*Math.PI*20)} style={{ filter:"drop-shadow(0 0 4px "+g.color+")" }}/>
            </svg>
          </div>

          <div style={{ marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
              <span style={{ fontSize:10, color:"#2d3f5a", fontFamily:"'DM Mono',monospace" }}>BOOK PROBABILITY</span>
              <span style={{ fontSize:10, color:"#2d3f5a", fontFamily:"'DM Mono',monospace" }}>MODEL PROBABILITY</span>
            </div>
            <div style={{ position:"relative", height:8, background:"rgba(255,255,255,0.04)", borderRadius:4 }}>
              <div style={{ position:"absolute", left:0, top:0, height:"100%", borderRadius:4, width:prop.implied_prob, background:"rgba(100,116,139,.35)" }}/>
              <div style={{ position:"absolute", left:0, top:0, height:"100%", borderRadius:4, width:prop.model_prob, background:"linear-gradient(90deg,"+g.color+"60,"+g.color+")", boxShadow:"0 0 8px "+g.color+"40" }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
              <span style={{ fontSize:12, color:"#3d5170", fontFamily:"'DM Mono',monospace" }}>{prop.implied_prob}</span>
              <span style={{ fontSize:12, color:g.color, fontWeight:700, fontFamily:"'DM Mono',monospace" }}>{prop.model_prob}</span>
            </div>
          </div>

          {prop.category_scores && Object.keys(prop.category_scores).length > 0 && (
            <div style={{ marginBottom:20, padding:"12px 16px", background:"rgba(255,255,255,0.02)", borderRadius:10, border:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize:9, color:"#1e3550", fontFamily:"'DM Mono',monospace", letterSpacing:".12em", marginBottom:10 }}>CATEGORY SCORES</div>
              <div style={{ display:"flex", gap:8 }}>
                {Object.entries(prop.category_scores).map(function(entry) {
                  const cat = entry[0];
                  const score = entry[1];
                  const s = score >= 65 ? "positive" : score <= 40 ? "negative" : "neutral";
                  return (
                    <div key={cat} style={{ flex:1, textAlign:"center" }}>
                      <div style={{ fontSize:9, color:"#2d3f5a", fontFamily:"'DM Mono',monospace", marginBottom:4 }}>{cat.toUpperCase().slice(0,4)}</div>
                      <div style={{ height:40, background:"rgba(255,255,255,0.03)", borderRadius:4, position:"relative", overflow:"hidden" }}>
                        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:score+"%", background:signalColor(s)+"40", borderRadius:4 }}/>
                        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <span style={{ fontSize:11, fontWeight:800, color:signalColor(s), fontFamily:"'Barlow Condensed',sans-serif" }}>{Math.round(score)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:4, marginBottom:16, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            {tabs.map(function(t) {
              const s = catSignal(prop, t.id);
              const isActive = activeTab === t.id;
              return (
                <button key={t.id} onClick={function(){setActiveTab(t.id);}} style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 12px 10px", background:"transparent", border:"none", borderBottom:"2px solid "+(isActive?signalColor(s):"transparent"), cursor:"pointer", transition:"all .18s", opacity:isActive?1:0.5 }}>
                  <span style={{ fontSize:12 }}>{t.icon}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:isActive?signalColor(s):"#475569", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:".06em", whiteSpace:"nowrap" }}>{t.label.toUpperCase()}</span>
                  <span style={{ fontSize:8, color:signalColor(s) }}>{signalIcon(s)}</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginBottom:16 }}>
            {activeTab==="hitter"         && <FactorPanel title="HITTER FACTORS"      icon="🏏" data={prop.hitter}         fields={hitterFields}  signal={catSignal(prop,"hitter")}/>}
            {activeTab==="pitcher_detail" && <FactorPanel title="PITCHER FACTORS"     icon="⚾" data={prop.pitcher_detail}  fields={pitcherFields} signal={catSignal(prop,"pitcher_detail")}/>}
            {activeTab==="park"           && <FactorPanel title="BALLPARK FACTORS"    icon="🏟️" data={prop.park}           fields={parkFields}    signal={catSignal(prop,"park")}/>}
            {activeTab==="weather"        && <FactorPanel title="WEATHER CONDITIONS"  icon="🌤️" data={prop.weather}        fields={weatherFields} signal={catSignal(prop,"weather")}/>}
            {activeTab==="situational"    && <FactorPanel title="SITUATIONAL FACTORS" icon="📋" data={prop.situational}    fields={sitFields}     signal={catSignal(prop,"situational")}/>}
          </div>

          <div style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 16px", background:"rgba(255,255,255,.018)", borderRadius:8, border:"1px solid rgba(255,255,255,0.05)" }}>
            {[
              {label:"BARREL RATE", val:prop.hitter_statcast&&prop.hitter_statcast.barrel_pct ? prop.hitter_statcast.barrel_pct : prop.hitter&&prop.hitter.barrelPct},
              {label:"EXIT VELO",   val:prop.hitter_statcast&&prop.hitter_statcast.exit_velo_avg ? prop.hitter_statcast.exit_velo_avg+" mph" : prop.hitter&&prop.hitter.exitVeloAvg},
              {label:"xwOBA",       val:prop.hitter&&prop.hitter.xwOBA},
              {label:"OPPONENT",    val:prop.opponent},
            ].map(function(s, i) {
              return (
                <div key={i} style={{ flex:1 }}>
                  <div style={{ fontSize:9, color:"#2d3f5a", fontFamily:"'DM Mono',monospace", letterSpacing:".1em" }}>{s.label}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:"#e2e8f0", fontFamily:"'Barlow Condensed',sans-serif", marginTop:1 }}>{s.val||"—"}</div>
                </div>
              );
            })}
            <button onClick={function(e){e.stopPropagation();}} style={{ padding:"8px 16px", borderRadius:8, cursor:"pointer", flexShrink:0, background:g.glow, border:"1px solid "+g.color+"45", color:g.color, fontSize:11, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:".1em" }}>+ TRACK BET</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROP PAGE ────────────────────────────────────────────────────────────────
function PropPage({ propType, allProps, loading }) {
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy]     = useState("confidence");
  const [tierFilter, setTier]   = useState("All");
  const pm = propMeta[propType];

  const list = allProps
    .filter(function(p){ return p.prop_type === propType; })
    .filter(function(p){
      if (tierFilter==="A Tier") return p.confidence >= 80;
      if (tierFilter==="B Tier") return p.confidence >= 70 && p.confidence < 80;
      if (tierFilter==="C Tier") return p.confidence < 70;
      return true;
    })
    .sort(function(a,b){ return sortBy==="edge" ? (b.edge||0)-(a.edge||0) : b.confidence-a.confidence; });

  const top = list[0];

  return (
    <div>
      <div style={{ padding:"32px 0 24px", borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ fontSize:46 }}>{pm.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:pm.color, fontFamily:"'DM Mono',monospace", letterSpacing:".2em", marginBottom:6 }}>BASEBALLIQ · {propType.toUpperCase()} PROPS</div>
            <h2 style={{ fontSize:42, fontWeight:900, color:"#f1f5f9", fontFamily:"'Barlow Condensed',sans-serif", lineHeight:.9, margin:0 }}>
              {propType.toUpperCase()}<br/><span style={{ color:pm.color }}>CONFIDENCE BOARD</span>
            </h2>
          </div>
          {top && (
            <div style={{ textAlign:"right", padding:"14px 18px", background:pm.bg, border:"1px solid "+pm.border, borderRadius:12 }}>
              <div style={{ fontSize:9, color:"#2d3f5a", fontFamily:"'DM Mono',monospace", letterSpacing:".12em", marginBottom:4 }}>TODAY'S TOP PICK</div>
              <div style={{ fontSize:18, fontWeight:900, color:pm.color, fontFamily:"'Barlow Condensed',sans-serif" }}>{top.player_name}</div>
              <div style={{ fontSize:11, color:"#3d5170", fontFamily:"'DM Mono',monospace" }}>{getGrade(top.confidence).letter} · {top.confidence}% · {top.edge_str} edge</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:20, flexWrap:"wrap" }}>
        <span style={{ fontSize:9, color:"#1e3550", fontFamily:"'DM Mono',monospace", letterSpacing:".12em" }}>TIER:</span>
        {["All","A Tier","B Tier","C Tier"].map(function(t) {
          return (
            <button key={t} onClick={function(){setTier(t);}} style={{ padding:"5px 11px", borderRadius:7, fontSize:10, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:".04em", background:tierFilter===t?pm.color+"22":"rgba(255,255,255,.03)", color:tierFilter===t?pm.color:"#2d3f5a", border:"1px solid "+(tierFilter===t?pm.color+"50":"rgba(255,255,255,.06)") }}>{t.toUpperCase()}</button>
          );
        })}
        <div style={{ flex:1 }}/>
        {["confidence","edge"].map(function(s) {
          return (
            <button key={s} onClick={function(){setSortBy(s);}} style={{ padding:"5px 11px", borderRadius:7, fontSize:10, cursor:"pointer", fontFamily:"'DM Mono',monospace", background:sortBy===s?"rgba(255,255,255,.07)":"transparent", color:sortBy===s?"#94a3b8":"#1e3550", border:"1px solid "+(sortBy===s?"rgba(255,255,255,.12)":"rgba(255,255,255,.03)") }}>↓ {s}</button>
          );
        })}
      </div>
      {loading
        ? <LoadingSkeleton/>
        : list.length === 0
          ? <div style={{ textAlign:"center", padding:"48px 0", color:"#1e3550", fontFamily:"'DM Mono',monospace", fontSize:12 }}>No props found for this type today.</div>
          : list.map(function(prop, i) {
              return <PropCard key={prop.id||i} prop={prop} rank={i+1} expanded={expanded===i} onToggle={function(){setExpanded(expanded===i?null:i);}}/>;
            })
      }
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ navigate, allProps, loading, isLive }) {
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy]     = useState("confidence");

  const sorted = allProps.slice().sort(function(a,b){
    return sortBy==="edge" ? (b.edge||0)-(a.edge||0) : b.confidence-a.confidence;
  });

  const aCount = allProps.filter(function(p){ return p.confidence >= 80; }).length;
  const bCount = allProps.filter(function(p){ return p.confidence >= 70 && p.confidence < 80; }).length;
  const cCount = allProps.filter(function(p){ return p.confidence < 70; }).length;

  const sections = Object.keys(propMeta).map(function(type) {
    const typeProps = allProps.filter(function(p){ return p.prop_type === type; });
    return {
      type: type,
      count: typeProps.length,
      top: typeProps.sort(function(a,b){ return b.confidence - a.confidence; })[0],
    };
  });

  const avgEdge = allProps.length
    ? "+"+(allProps.reduce(function(s,p){ return s+(p.edge||0); }, 0)/allProps.length*100).toFixed(1)+"%"
    : "—";

  return (
    <div>
      <div style={{ paddingTop:36, paddingBottom:26, borderBottom:"1px solid rgba(255,255,255,0.05)", marginBottom:26 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ fontSize:10, letterSpacing:".22em", color:"#22d3a5", fontFamily:"'DM Mono',monospace" }}>BASEBALLIQ · TODAY'S FEED</div>
              <DataBadge isLive={isLive}/>
            </div>
            <h1 style={{ fontSize:52, fontWeight:900, lineHeight:.86, fontFamily:"'Barlow Condensed',sans-serif", color:"#f1f5f9", margin:0 }}>
              ALL<br/><span style={{ color:"#22d3a5" }}>TOP PLAYS</span>
            </h1>
            <div style={{ fontSize:11, color:"#2d3f5a", fontFamily:"'DM Mono',monospace", marginTop:10 }}>5 factor categories · 30+ data points per player</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"#1a3050", fontFamily:"'DM Mono',monospace", letterSpacing:".1em" }}>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}).toUpperCase()}</div>
            <div style={{ fontSize:10, color:"#22d3a5", marginTop:5, fontFamily:"'DM Mono',monospace" }}>● {isLive?"LIVE ODDS":"DEMO MODE"}</div>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,255,255,0.06)", marginBottom:26 }}>
        {[
          {label:"TOTAL PROPS",  val:allProps.length,      c:null},
          {label:"A / A+ PLAYS", val:aCount,                c:"#22d3a5"},
          {label:"B PLAYS",      val:bCount,                c:"#facc15"},
          {label:"C PLAYS",      val:cCount,                c:"#f97316"},
          {label:"AVG EDGE",     val:avgEdge,               c:null},
          {label:"DATA SOURCE",  val:isLive?"LIVE":"DEMO",  c:isLive?"#22d3a5":"#fb923c"},
        ].map(function(s, i) {
          return (
            <div key={i} style={{ flex:1, padding:"12px 14px", background:i%2===0?"rgba(255,255,255,.018)":"rgba(255,255,255,.012)", borderRight:i<5?"1px solid rgba(255,255,255,.05)":"none" }}>
              <div style={{ fontSize:8, color:"#1e3550", letterSpacing:".14em", fontFamily:"'DM Mono',monospace", marginBottom:3 }}>{s.label}</div>
              <div style={{ fontSize:20, fontWeight:900, color:s.c||"#e2e8f0", fontFamily:"'Barlow Condensed',sans-serif" }}>{s.val}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom:30 }}>
        <div style={{ fontSize:9, color:"#1e3550", letterSpacing:".16em", fontFamily:"'DM Mono',monospace", marginBottom:12 }}>BROWSE BY PROP TYPE</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
          {sections.map(function(ps) {
            const pm = propMeta[ps.type];
            const topG = ps.top ? getGrade(ps.top.confidence) : null;
            return (
              <div key={ps.type} onClick={function(){navigate(ps.type);}} style={{ padding:"16px 14px", borderRadius:12, cursor:"pointer", background:"linear-gradient(145deg,"+pm.bg+",rgba(255,255,255,.02))", border:"1px solid "+pm.border, transition:"all .2s ease" }}
                onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px "+pm.bg;}}
                onMouseLeave={function(e){e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{ fontSize:24, marginBottom:8 }}>{pm.icon}</div>
                <div style={{ fontSize:12, fontWeight:800, color:pm.color, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:".04em", marginBottom:2 }}>{ps.type.toUpperCase()}</div>
                <div style={{ fontSize:10, color:"#2d3f5a", fontFamily:"'DM Mono',monospace", marginBottom:8 }}>{ps.count} props today</div>
                {ps.top && topG
                  ? <div style={{ padding:"4px 8px", borderRadius:6, background:topG.glow, border:"1px solid "+topG.color+"30", display:"inline-block" }}>
                      <span style={{ fontSize:10, fontWeight:700, color:topG.color, fontFamily:"'Barlow Condensed',sans-serif" }}>{topG.letter} · {ps.top.player_name.split(" ").pop()}</span>
                    </div>
                  : <div style={{ fontSize:10, color:"#1e3550", fontFamily:"'DM Mono',monospace" }}>No props yet</div>
                }
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontSize:9, color:"#1e3550", letterSpacing:".16em", fontFamily:"'DM Mono',monospace" }}>ALL PROPS — RANKED BY CONFIDENCE</div>
        <div style={{ display:"flex", gap:5 }}>
          {["confidence","edge"].map(function(s) {
            return (
              <button key={s} onClick={function(){setSortBy(s);}} style={{ padding:"5px 10px", borderRadius:7, fontSize:10, cursor:"pointer", fontFamily:"'DM Mono',monospace", background:sortBy===s?"rgba(255,255,255,.07)":"transparent", color:sortBy===s?"#94a3b8":"#1e3550", border:"1px solid "+(sortBy===s?"rgba(255,255,255,.12)":"rgba(255,255,255,.03)") }}>↓ {s}</button>
            );
          })}
        </div>
      </div>

      {loading
        ? <LoadingSkeleton/>
        : sorted.map(function(prop, i) {
            return <PropCard key={prop.id||i} prop={prop} rank={i+1} expanded={expanded===i} onToggle={function(){setExpanded(expanded===i?null:i);}}/>;
          })
      }
    </div>
  );
}

// ─── NAV BAR ──────────────────────────────────────────────────────────────────
function NavBar({ active, navigate }) {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(5,12,30,.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ maxWidth:860, margin:"0 auto", padding:"0 22px", display:"flex", alignItems:"center", gap:2, overflowX:"auto" }}>
        <div style={{ marginRight:18, padding:"14px 0", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <span style={{ fontSize:18 }}>⚾</span>
          <span style={{ fontSize:14, fontWeight:900, color:"#22d3a5", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:".1em" }}>BASEBALLIQ</span>
        </div>
        <div style={{ width:1, height:20, background:"rgba(255,255,255,0.08)", marginRight:8, flexShrink:0 }}/>
        {navItems.map(function(item) {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={function(){navigate(item.id);}} style={{ padding:"0 14px", height:52, background:"transparent", border:"none", borderBottom:"2px solid "+(isActive?item.color:"transparent"), cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all .18s", flexShrink:0, opacity:isActive?1:0.45 }}
              onMouseEnter={function(e){if(!isActive)e.currentTarget.style.opacity=".75";}}
              onMouseLeave={function(e){if(!isActive)e.currentTarget.style.opacity=".45";}}>
              <span style={{ fontSize:14 }}>{item.icon}</span>
              <span style={{ fontSize:12, fontWeight:700, color:isActive?item.color:"#64748b", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:".06em", whiteSpace:"nowrap" }}>{item.label.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState("home");
  const [allProps, setAllProps]  = useState([]);
  const [loading, setLoading]   = useState(true);
  const [isLive, setIsLive]     = useState(false);

  useEffect(function() {
    const controller = new AbortController();
    const timeout = setTimeout(function(){ controller.abort(); }, 60000);

    fetch(API_URL + "/api/props", { signal: controller.signal })
      .then(function(res){ return res.json(); })
      .then(function(data) {
        clearTimeout(timeout);
        if (data.props && data.props.length > 0) {
          setAllProps(data.props);
          setIsLive(true);
        } else {
          setAllProps(mockProps);
          setIsLive(false);
        }
        setLoading(false);
      })
      .catch(function() {
        clearTimeout(timeout);
        setAllProps(mockProps);
        setIsLive(false);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#050c1e 0%,#091222 50%,#050b1c 100%)" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0} button{outline:none} ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:2px}"}</style>
      <NavBar active={page} navigate={setPage}/>
      <div style={{ maxWidth:860, margin:"0 auto", padding:"0 22px 64px" }}>
        {page === "home"
          ? <HomePage navigate={setPage} allProps={allProps} loading={loading} isLive={isLive}/>
          : <PropPage propType={page} allProps={allProps} loading={loading}/>
        }
        <div style={{ textAlign:"center", marginTop:44, fontSize:9, color:"#0d1e30", fontFamily:"'DM Mono',monospace", letterSpacing:".12em" }}>
          FOR ENTERTAINMENT PURPOSES ONLY · NOT FINANCIAL ADVICE · BET RESPONSIBLY
        </div>
      </div>
    </div>
  );
}
