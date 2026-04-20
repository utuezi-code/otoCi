'use client';

export default function CarBackground() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      overflow: 'hidden', pointerEvents: 'none',
    }}>
      {/* Deep radial glow behind car */}
      <div style={{
        position: 'absolute',
        bottom: '0', left: '50%',
        transform: 'translateX(-50%)',
        width: '900px', height: '400px',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.07) 0%, transparent 70%)',
      }}/>

      {/* Ground reflection line */}
      <div style={{
        position: 'absolute',
        bottom: '120px', left: '50%',
        transform: 'translateX(-50%)',
        width: '700px', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), rgba(201,168,76,0.3), rgba(201,168,76,0.15), transparent)',
        animation: 'groundPulse 3s ease-in-out infinite',
      }}/>

      {/* The car SVG */}
      <div style={{
        position: 'absolute',
        bottom: '80px', left: '50%',
        transform: 'translateX(-50%)',
        width: '680px',
        animation: 'carFloat 6s ease-in-out infinite',
        opacity: 0.18,
      }}>
        <svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg" fill="none">
          {/* Car shadow / ground reflection */}
          <ellipse cx="340" cy="210" rx="260" ry="12" fill="url(#shadowGrad)" opacity="0.6"/>

          {/* Body main shape */}
          <path d="M80 160 L80 120 Q85 80 130 65 L220 45 Q270 28 340 26 Q410 28 460 45 L550 65 Q595 80 600 120 L600 160 Q600 168 592 168 L88 168 Q80 168 80 160Z"
            fill="url(#bodyGrad)" stroke="rgba(201,168,76,0.4)" strokeWidth="1"/>

          {/* Roof */}
          <path d="M200 65 Q240 28 340 24 Q440 28 480 65"
            fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="1"/>

          {/* Windshield */}
          <path d="M215 65 Q255 32 340 28 Q425 32 465 65 L450 68 Q410 38 340 35 Q270 38 230 68Z"
            fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8"/>

          {/* Rear window */}
          <path d="M150 65 L200 65 L230 68 L220 90 L148 90Z"
            fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8"/>

          {/* Front window */}
          <path d="M450 68 L480 65 L530 90 L460 90Z"
            fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8"/>

          {/* Door lines */}
          <line x1="340" y1="68" x2="340" y2="162" stroke="rgba(201,168,76,0.15)" strokeWidth="0.8"/>
          <line x1="240" y1="72" x2="240" y2="162" stroke="rgba(201,168,76,0.12)" strokeWidth="0.6"/>
          <line x1="440" y1="72" x2="440" y2="162" stroke="rgba(201,168,76,0.12)" strokeWidth="0.6"/>

          {/* Door handles */}
          <rect x="278" y="118" width="22" height="5" rx="2.5" fill="rgba(201,168,76,0.35)" stroke="rgba(201,168,76,0.5)" strokeWidth="0.5"/>
          <rect x="380" y="118" width="22" height="5" rx="2.5" fill="rgba(201,168,76,0.35)" stroke="rgba(201,168,76,0.5)" strokeWidth="0.5"/>

          {/* Headlights */}
          <path d="M592 105 L615 100 L622 112 L600 118Z" fill="rgba(201,168,76,0.5)" stroke="rgba(201,168,76,0.8)" strokeWidth="0.8"/>
          {/* Headlight beam */}
          <path d="M620 106 L700 85 L710 115 L622 118Z" fill="url(#beamGrad)" opacity="0.6"/>
          {/* DRL strip */}
          <line x1="594" y1="100" x2="610" y2="97" stroke="rgba(240,201,122,0.9)" strokeWidth="1.5" strokeLinecap="round"/>

          {/* Taillights */}
          <path d="M88 105 L72 100 L68 115 L80 118Z" fill="rgba(201,168,76,0.4)" stroke="rgba(201,168,76,0.6)" strokeWidth="0.8"/>
          <line x1="86" y1="100" x2="72" y2="97" stroke="rgba(201,168,76,0.7)" strokeWidth="1.5" strokeLinecap="round"/>

          {/* Wheel arches */}
          <path d="M120 168 Q120 138 155 138 Q190 138 190 168" fill="var(--ink-2,#111)" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
          <path d="M490 168 Q490 138 525 138 Q560 138 560 168" fill="var(--ink-2,#111)" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>

          {/* Wheels */}
          <circle cx="155" cy="172" r="30" fill="url(#wheelGrad)" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5"/>
          <circle cx="155" cy="172" r="22" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="1"/>
          <circle cx="155" cy="172" r="8"  fill="rgba(201,168,76,0.3)" stroke="rgba(201,168,76,0.6)" strokeWidth="1"/>
          {/* Wheel spokes */}
          {[0,60,120,180,240,300].map(angle => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 155 + 10 * Math.cos(rad); const y1 = 172 + 10 * Math.sin(rad);
            const x2 = 155 + 21 * Math.cos(rad); const y2 = 172 + 21 * Math.sin(rad);
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,168,76,0.35)" strokeWidth="1.5"/>;
          })}

          <circle cx="525" cy="172" r="30" fill="url(#wheelGrad)" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5"/>
          <circle cx="525" cy="172" r="22" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="1"/>
          <circle cx="525" cy="172" r="8"  fill="rgba(201,168,76,0.3)" stroke="rgba(201,168,76,0.6)" strokeWidth="1"/>
          {[0,60,120,180,240,300].map(angle => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 525 + 10 * Math.cos(rad); const y1 = 172 + 10 * Math.sin(rad);
            const x2 = 525 + 21 * Math.cos(rad); const y2 = 172 + 21 * Math.sin(rad);
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,168,76,0.35)" strokeWidth="1.5"/>;
          })}

          {/* Electric charge bolt on body */}
          <path d="M330 80 L322 100 L334 100 L326 120 L348 95 L336 95 L344 80Z"
            fill="rgba(201,168,76,0.6)" stroke="rgba(240,201,122,0.8)" strokeWidth="0.8"
            style={{animation:'boltPulse 2s ease-in-out infinite'}}/>

          {/* Electric particles floating */}
          <circle cx="360" cy="55" r="2" fill="rgba(201,168,76,0.8)" style={{animation:'particle1 3s ease-in-out infinite'}}/>
          <circle cx="290" cy="48" r="1.5" fill="rgba(201,168,76,0.6)" style={{animation:'particle2 4s ease-in-out infinite'}}/>
          <circle cx="420" cy="60" r="1.5" fill="rgba(201,168,76,0.6)" style={{animation:'particle3 3.5s ease-in-out infinite'}}/>
          <circle cx="250" cy="70" r="1" fill="rgba(201,168,76,0.4)" style={{animation:'particle1 5s ease-in-out infinite'}}/>
          <circle cx="450" cy="52" r="1" fill="rgba(201,168,76,0.4)" style={{animation:'particle2 4.5s ease-in-out infinite'}}/>

          {/* Speed lines under car */}
          <line x1="90" y1="195" x2="180" y2="195" stroke="rgba(201,168,76,0.08)" strokeWidth="1" style={{animation:'speedLine 2s linear infinite'}}/>
          <line x1="60" y1="200" x2="200" y2="200" stroke="rgba(201,168,76,0.05)" strokeWidth="0.8" style={{animation:'speedLine 2.5s linear infinite'}}/>

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(201,168,76,0.12)"/>
              <stop offset="50%" stopColor="rgba(201,168,76,0.05)"/>
              <stop offset="100%" stopColor="rgba(201,168,76,0.08)"/>
            </linearGradient>
            <radialGradient id="shadowGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(201,168,76,0.2)"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
            <radialGradient id="wheelGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="rgba(60,60,60,1)"/>
              <stop offset="100%" stopColor="rgba(20,20,20,1)"/>
            </radialGradient>
            <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(245,217,139,0.4)"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Charging arc animation around car */}
      <div style={{
        position: 'absolute',
        bottom: '60px', left: '50%',
        transform: 'translateX(-50%)',
        width: '720px', height: '260px',
        animation: 'arcRotate 8s linear infinite',
        opacity: 0.12,
      }}>
        <svg viewBox="0 0 720 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="360" cy="130" rx="340" ry="120"
            stroke="rgba(201,168,76,0.6)" strokeWidth="1"
            strokeDasharray="20 12" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Outer arc - counter rotate */}
      <div style={{
        position: 'absolute',
        bottom: '40px', left: '50%',
        transform: 'translateX(-50%)',
        width: '800px', height: '300px',
        animation: 'arcRotateReverse 12s linear infinite',
        opacity: 0.07,
      }}>
        <svg viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="400" cy="150" rx="380" ry="140"
            stroke="rgba(201,168,76,0.8)" strokeWidth="0.8"
            strokeDasharray="8 24" strokeLinecap="round"/>
        </svg>
      </div>

      <style>{`
        @keyframes carFloat {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes groundPulse {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) scaleX(1); }
          50%       { opacity: 0.8; transform: translateX(-50%) scaleX(0.85); }
        }
        @keyframes boltPulse {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 4px rgba(201,168,76,0.4)); }
          50%       { opacity: 1;   filter: drop-shadow(0 0 10px rgba(245,217,139,0.9)); }
        }
        @keyframes particle1 {
          0%   { transform: translate(0,0) scale(1); opacity: 0.8; }
          50%  { transform: translate(4px,-12px) scale(1.4); opacity: 0.4; }
          100% { transform: translate(0,0) scale(1); opacity: 0.8; }
        }
        @keyframes particle2 {
          0%   { transform: translate(0,0) scale(1); opacity: 0.6; }
          50%  { transform: translate(-5px,-15px) scale(1.6); opacity: 0.2; }
          100% { transform: translate(0,0) scale(1); opacity: 0.6; }
        }
        @keyframes particle3 {
          0%   { transform: translate(0,0) scale(1); opacity: 0.5; }
          50%  { transform: translate(6px,-10px) scale(1.3); opacity: 0.15; }
          100% { transform: translate(0,0) scale(1); opacity: 0.5; }
        }
        @keyframes speedLine {
          0%   { transform: translateX(0); opacity: 0.6; }
          100% { transform: translateX(-300px); opacity: 0; }
        }
        @keyframes arcRotate {
          from { transform: translateX(-50%) rotate(0deg); }
          to   { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes arcRotateReverse {
          from { transform: translateX(-50%) rotate(0deg); }
          to   { transform: translateX(-50%) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
