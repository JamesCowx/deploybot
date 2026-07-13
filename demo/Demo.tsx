import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const STAGES = [
  { name: 'Build', icon: 'âš™', color: '#60a5fa' },
  { name: 'Unit Tests', icon: 'ðŸ§ª', color: '#a78bfa' },
  { name: 'Security Scan', icon: 'ðŸ›¡', color: '#fbbf24' },
  { name: 'Staging Deploy', icon: 'ðŸ“¦', color: '#38bdf8' },
  { name: 'Integration Tests', icon: 'ðŸ”—', color: '#f472b6' },
  { name: 'Production Deploy', icon: 'ðŸš€', color: '#34d399' },
];

export default function PipelineDemo() {
  const [current, setCurrent] = useState(-1);
  const [statuses, setStatuses] = useState<string[]>(new Array(STAGES.length).fill('idle'));
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || current >= STAGES.length) return;
    setStatuses((prev) => prev.map((s, i) => (i < current ? 'done' : i === current ? 'running' : 'idle')));
    const durations = [1200, 1600, 2000, 1400, 1800, 1500];
    const timer = setTimeout(() => {
      setStatuses((prev) => prev.map((s, i) => (i === current ? 'done' : s)));
      setCurrent((c) => c + 1);
    }, durations[current] || 1000);
    return () => clearTimeout(timer);
  }, [current, running]);

  useEffect(() => {
    if (current >= STAGES.length && running) setRunning(false);
  }, [current, running]);

  function run() { setCurrent(0); setStatuses(new Array(STAGES.length).fill('idle')); setRunning(true); }

  const elapsed = statuses.filter((s) => s === 'done').length;

  return (
    <div className="liquid-glass rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#60a5fa]/15 flex items-center justify-center text-sm">ðŸš€</div>
          <div>
            <h3 className="text-sm font-semibold">CI/CD Pipeline</h3>
            <div className="text-[10px] text-[var(--color-text-muted)]">
              {running ? `Running Â· Stage ${current + 1}/${STAGES.length}` : current >= STAGES.length ? 'âœ“ Completed' : 'Ready'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[var(--color-text-muted)] px-2 py-0.5 rounded-md bg-white/[0.03]">build #{(current >= 0 ? current : 0) + 847}</span>
          <button onClick={run} disabled={running}
            className="px-4 py-1.5 rounded-xl text-[11px] font-medium bg-[#4f8fde] text-white disabled:opacity-30 hover:bg-[#60a5fa] hover:shadow-[0_4px_16px_rgba(96,165,250,0.2)] transition-all cursor-pointer">
            {current >= STAGES.length ? 'Re-run' : running ? 'Running' : 'Run'}
          </button>
        </div>
      </div>

      <div className="relative">
        {STAGES.map((stage, i) => {
          const status = statuses[i];
          let borderCol = 'border-white/[0.04]';
          let bg = 'bg-transparent';
          let textCol = 'text-[var(--color-text-muted)]';
          let iconBg = 'bg-white/[0.04]';

          if (status === 'done') { borderCol = 'border-green-500/30'; bg = 'bg-green-500/[0.03]'; textCol = 'text-green-400'; iconBg = 'bg-green-500/15'; }
          else if (status === 'running') { borderCol = 'border-[#60a5fa]/30'; bg = 'bg-[#60a5fa]/[0.04]'; textCol = 'text-[#60a5fa]'; iconBg = 'bg-[#60a5fa]/15'; }

          return (
            <div key={stage.name} className="flex items-center mb-1">
              <motion.div className={`flex items-center gap-3 flex-1 px-4 py-3 rounded-xl border ${borderCol} ${bg} transition-all duration-500`}
                animate={status === 'running' ? { x: [0, -3, 0, 3, 0] } : {}}
                transition={status === 'running' ? { repeat: Infinity, duration: 1.5 } : {}}>
                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center text-sm`}>{stage.icon}</div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${textCol}`}>{stage.name}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
                    {status === 'idle' && 'waiting'}
                    {status === 'running' && 'in progress...'}
                    {status === 'done' && `passed (${[1.2, 0.8, 2.1, 0.4, 1.1, 0.9][i]}s)`}
                  </p>
                </div>
                <div>
                  {status === 'done' && <span className="text-green-400 font-bold">âœ“</span>}
                  {status === 'running' && (
                    <span className="inline-flex gap-0.5">
                      {['â–', 'â–ƒ', 'â–…', 'â–‡'].map((c, ci) => (
                        <span key={ci} className="text-[11px] animate-bounce" style={{ animationDelay: `${ci * 80}ms`, color: '#60a5fa' }}>{c}</span>
                      ))}
                    </span>
                  )}
                  {status === 'idle' && <span className="text-[var(--color-text-muted)] text-xs">â€”</span>}
                </div>
              </motion.div>
              {i < STAGES.length - 1 && (
                <div className={`w-6 flex justify-center ${status === 'done' ? 'text-green-400/30' : 'text-white/[0.06]'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {current >= STAGES.length && (
        <div className="p-4 rounded-xl bg-green-500/[0.04] border border-green-500/20 text-center">
          <span className="text-green-400 text-sm font-medium">Pipeline completed in ~{(elapsed * 1.4).toFixed(1)}s</span>
          <div className="flex gap-3 justify-center mt-2">
            {['All tests passed', 'Security scan clean', 'Deployed âœ“'].map((m) => (
              <span key={m} className="text-[10px] text-green-400/60">{m}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

