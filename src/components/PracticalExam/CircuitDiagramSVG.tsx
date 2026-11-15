import React from 'react';

interface Props {
  experimentId: string;
  variantId?: string | null;
}

const PinTag: React.FC<{ x: number; y: number; text: string; align?: 'start' | 'middle' | 'end'; color?: string }> = ({
  x,
  y,
  text,
  align = 'middle',
  color = '#94a3b8',
}) => (
  <text x={x} y={y} textAnchor={align} fill={color} fontSize={9.5} fontFamily="JetBrains Mono, monospace" fontWeight={600}>
    {text}
  </text>
);

const ICBlock: React.FC<{ x: number; y: number; w: number; h: number; title: string; subtitle?: string }> = ({
  x,
  y,
  w,
  h,
  title,
  subtitle,
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={5} fill="#0b1220" stroke="#38bdf8" strokeWidth={1.5} />
    <text
      x={x + w / 2}
      y={y + h / 2 - (subtitle ? 3 : -4)}
      textAnchor="middle"
      fill="#f8fafc"
      fontSize={12}
      fontFamily="JetBrains Mono, monospace"
      fontWeight={700}
    >
      {title}
    </text>
    {subtitle && (
      <text
        x={x + w / 2}
        y={y + h / 2 + 12}
        textAnchor="middle"
        fill="#64748b"
        fontSize={9.5}
        fontFamily="JetBrains Mono, monospace"
      >
        {subtitle}
      </text>
    )}
  </g>
);

export const CircuitDiagramSVG: React.FC<Props> = ({ experimentId, variantId }) => {
  const renderDiagram = () => {
    switch (experimentId) {
      case 'exp-multiplexer':
        return (
          <g>
            <ICBlock x={190} y={28} w={180} h={172} title="IC 74153" subtitle="4:1 MUX (Channel A)" />
            {/* Data & Enable Left */}
            {[
              { y: 50, lbl: 'I0 (D0) → Pin 6', c: '#60a5fa' },
              { y: 74, lbl: 'I1 (D1) → Pin 5', c: '#60a5fa' },
              { y: 98, lbl: 'I2 (D2) → Pin 4', c: '#60a5fa' },
              { y: 122, lbl: 'I3 (D3) → Pin 3', c: '#60a5fa' },
              { y: 148, lbl: 'S0 (D4) → Pin 14', c: '#c084fc' },
              { y: 170, lbl: 'S1 (D5) → Pin 2', c: '#c084fc' },
              { y: 190, lbl: 'EA\' (D6) → Pin 1 (o)', c: '#fbbf24' },
            ].map((item, i) => (
              <g key={i}>
                <line x1={130} y1={item.y} x2={190} y2={item.y} stroke={item.c} strokeWidth={1.6} />
                <PinTag x={124} y={item.y + 3} text={item.lbl} align="end" color={item.c} />
              </g>
            ))}
            {/* Active-LOW bubble on EA' */}
            <circle cx={186} cy={190} r={4} fill="#0b1220" stroke="#fbbf24" strokeWidth={1.5} />
            {/* Output Y */}
            <line x1={370} y1={114} x2={445} y2={114} stroke="#22c55e" strokeWidth={2} />
            <PinTag x={452} y={117} text="Pin 7 (1Y) → D8" align="start" color="#4ade80" />
            <PinTag x={280} y={20} text="Pin 16 = +5V (VCC)  |  Pin 8 = GND" color="#94a3b8" />
          </g>
        );

      case 'exp-decoder':
        return (
          <g>
            <ICBlock x={190} y={26} w={175} h={184} title="IC 74138" subtitle="3:8 Decoder" />
            {[
              { y: 48, lbl: 'A (D0) → Pin 1', c: '#60a5fa' },
              { y: 72, lbl: 'B (D1) → Pin 2', c: '#60a5fa' },
              { y: 96, lbl: 'C (D2) → Pin 3', c: '#60a5fa' },
              { y: 132, lbl: 'G1 (D3=1) → Pin 6', c: '#fbbf24' },
              { y: 156, lbl: 'G2A\' (D4=0) → Pin 4', c: '#fbbf24', inv: true },
              { y: 180, lbl: 'G2B\' (D5=0) → Pin 5', c: '#fbbf24', inv: true },
            ].map((item, i) => (
              <g key={i}>
                <line x1={135} y1={item.y} x2={190} y2={item.y} stroke={item.c} strokeWidth={1.6} />
                {item.inv && <circle cx={186} cy={item.y} r={3.5} fill="#0b1220" stroke="#fbbf24" strokeWidth={1.4} />}
                <PinTag x={128} y={item.y + 3} text={item.lbl} align="end" color={item.c} />
              </g>
            ))}
            {[
              { pin: 15, y: 42, lbl: 'Y0\' (Pin 15) → D8' },
              { pin: 14, y: 63, lbl: 'Y1\' (Pin 14) → D9' },
              { pin: 13, y: 84, lbl: 'Y2\' (Pin 13) → D10' },
              { pin: 12, y: 105, lbl: 'Y3\' (Pin 12) → D11' },
              { pin: 11, y: 126, lbl: 'Y4\' (Pin 11) → D12' },
              { pin: 10, y: 147, lbl: 'Y5\' (Pin 10) → D13' },
              { pin: 9, y: 168, lbl: 'Y6\' (Pin 9) → D14' },
              { pin: 7, y: 189, lbl: 'Y7\' (Pin 7) → D15' },
            ].map((o) => (
              <g key={o.pin}>
                <circle cx={369} cy={o.y} r={3.5} fill="#0b1220" stroke="#22c55e" strokeWidth={1.4} />
                <line x1={373} y1={o.y} x2={425} y2={o.y} stroke="#22c55e" strokeWidth={1.5} />
                <PinTag x={432} y={o.y + 3} text={o.lbl} align="start" color="#4ade80" />
              </g>
            ))}
            <PinTag x={278} y={18} text="Pin 16 = +5V (VCC)  |  Pin 8 = GND" color="#94a3b8" />
          </g>
        );

      case 'exp-comparator':
        if (variantId === '1bit') {
          return (
            <g>
              {/* Input rails */}
              <PinTag x={28} y={56} text="A (D0)" align="start" color="#60a5fa" />
              <line x1={70} y1={52} x2={150} y2={52} stroke="#60a5fa" strokeWidth={1.8} />
              <PinTag x={28} y={136} text="B (D1)" align="start" color="#c084fc" />
              <line x1={70} y1={132} x2={150} y2={132} stroke="#c084fc" strokeWidth={1.8} />

              {/* Gate boxes */}
              <ICBlock x={150} y={24} w={155} h={52} title="7404 + 7408" subtitle="A·B' (Pin 3)" />
              <ICBlock x={150} y={88} w={155} h={52} title="7486 + 7404" subtitle="(A⊕B)' (Pin 6)" />
              <ICBlock x={150} y={152} w={155} h={52} title="7404 + 7408" subtitle="A'·B (Pin 6)" />

              {/* Connections */}
              <line x1={115} y1={52} x2={115} y2={176} stroke="#60a5fa" strokeWidth={1.3} strokeDasharray="3 2" />
              <line x1={115} y1={176} x2={150} y2={176} stroke="#60a5fa" strokeWidth={1.3} />
              <line x1={130} y1={132} x2={130} y2={112} stroke="#c084fc" strokeWidth={1.3} />
              <line x1={130} y1={112} x2={150} y2={112} stroke="#c084fc" strokeWidth={1.3} />

              {/* Outputs */}
              <line x1={305} y1={50} x2={395} y2={50} stroke="#22c55e" strokeWidth={1.8} />
              <PinTag x={402} y={54} text="A > B (7408 P3) → D8" align="start" color="#4ade80" />
              <line x1={305} y1={114} x2={395} y2={114} stroke="#22c55e" strokeWidth={1.8} />
              <PinTag x={402} y={118} text="A = B (7404 P6) → D9" align="start" color="#4ade80" />
              <line x1={305} y1={178} x2={395} y2={178} stroke="#22c55e" strokeWidth={1.8} />
              <PinTag x={402} y={182} text="A < B (7408 P6) → D10" align="start" color="#4ade80" />
            </g>
          );
        }
        return (
          <g>
            <ICBlock x={185} y={28} w={180} h={176} title="IC 7485" subtitle="4-Bit Comparator" />
            {[
              { y: 48, lbl: variantId === '4bit-cascade' ? 'A0,A1 (D0,D1) [A2,A3=0]' : 'A0–A3 (D0–D3) → P10,12,13,15', c: '#60a5fa' },
              { y: 84, lbl: variantId === '4bit-cascade' ? 'B0,B1 (D2,D3) [B2,B3=0]' : 'B0–B3 (D4–D7) → P9,11,14,1', c: '#c084fc' },
              { y: 126, lbl: variantId === '4bit-cascade' ? 'IA<B (D4) → Pin 2' : 'IA<B (GND) → Pin 2', c: '#fbbf24' },
              { y: 152, lbl: variantId === '4bit-cascade' ? 'IA=B (D5) → Pin 3' : 'IA=B (+5V) → Pin 3', c: '#fbbf24' },
              { y: 178, lbl: variantId === '4bit-cascade' ? 'IA>B (D6) → Pin 4' : 'IA>B (GND) → Pin 4', c: '#fbbf24' },
            ].map((item, i) => (
              <g key={i}>
                <line x1={142} y1={item.y} x2={185} y2={item.y} stroke={item.c} strokeWidth={1.6} />
                <PinTag x={136} y={item.y + 3} text={item.lbl} align="end" color={item.c} />
              </g>
            ))}
            {[
              { y: 76, lbl: 'OA>B (Pin 5) → D8' },
              { y: 116, lbl: 'OA=B (Pin 6) → D9' },
              { y: 156, lbl: 'OA<B (Pin 7) → D10' },
            ].map((o, i) => (
              <g key={i}>
                <line x1={365} y1={o.y} x2={425} y2={o.y} stroke="#22c55e" strokeWidth={1.8} />
                <PinTag x={432} y={o.y + 3} text={o.lbl} align="start" color="#4ade80" />
              </g>
            ))}
            <PinTag x={275} y={18} text="Pin 16 = +5V (VCC)  |  Pin 8 = GND" color="#94a3b8" />
          </g>
        );

      case 'exp-sr-flipflop':
        return (
          <g>
            {/* 4 NAND gates of 7400 */}
            <ICBlock x={110} y={32} w={110} h={56} title="NAND 1" subtitle="P1(S), P2(CLK) → P3" />
            <ICBlock x={110} y={132} w={110} h={56} title="NAND 2" subtitle="P4(CLK), P5(R) → P6" />
            <ICBlock x={285} y={32} w={115} h={56} title="NAND 3" subtitle="P10, P9(Q') → P8(Q)" />
            <ICBlock x={285} y={132} w={115} h={56} title="NAND 4" subtitle="P12(Q), P13 → P11(Q')" />
            {/* Inputs */}
            <PinTag x={54} y={46} text="S (D0)" align="end" color="#60a5fa" />
            <line x1={60} y1={42} x2={110} y2={42} stroke="#60a5fa" strokeWidth={1.6} />
            <PinTag x={54} y={114} text="CLK (D2)" align="end" color="#fb923c" />
            <line x1={60} y1={110} x2={88} y2={110} stroke="#fb923c" strokeWidth={1.6} />
            <polyline points="88,110 88,72 110,72" fill="none" stroke="#fb923c" strokeWidth={1.5} />
            <polyline points="88,110 88,148 110,148" fill="none" stroke="#fb923c" strokeWidth={1.5} />
            <PinTag x={54} y={178} text="R (D1)" align="end" color="#60a5fa" />
            <line x1={60} y1={174} x2={110} y2={174} stroke="#60a5fa" strokeWidth={1.6} />
            {/* Steering to latch */}
            <line x1={220} y1={60} x2={285} y2={46} stroke="#eab308" strokeWidth={1.6} />
            <line x1={220} y1={160} x2={285} y2={174} stroke="#eab308" strokeWidth={1.6} />
            {/* Cross-coupling */}
            <polyline points="400,60 422,60 422,102 260,122 260,146 285,146" fill="none" stroke="#c084fc" strokeWidth={1.5} />
            <polyline points="400,160 422,160 422,118 260,98 260,74 285,74" fill="none" stroke="#c084fc" strokeWidth={1.5} />
            {/* Outputs */}
            <line x1={400} y1={48} x2={460} y2={48} stroke="#22c55e" strokeWidth={2} />
            <PinTag x={466} y={51} text="Q (P8) → D8" align="start" color="#4ade80" />
            <line x1={400} y1={172} x2={460} y2={172} stroke="#22c55e" strokeWidth={2} />
            <PinTag x={466} y={175} text="Q' (P11) → D9" align="start" color="#4ade80" />
            <PinTag x={280} y={18} text="IC 7400  |  Pin 14 = +5V  |  Pin 7 = GND" color="#94a3b8" />
          </g>
        );

      case 'exp-jk-flipflop':
        return (
          <g>
            <ICBlock x={195} y={40} w={170} h={146} title="IC 7476" subtitle="Falling-Edge JK FF" />
            {/* PRE' top */}
            <line x1={280} y1={14} x2={280} y2={36} stroke="#c084fc" strokeWidth={1.6} />
            <circle cx={280} cy={38} r={3.5} fill="#0b1220" stroke="#c084fc" strokeWidth={1.4} />
            <PinTag x={288} y={24} text="PRE' (D3) → P2" align="start" color="#c084fc" />
            {/* CLR' bottom */}
            <circle cx={280} cy={188} r={3.5} fill="#0b1220" stroke="#c084fc" strokeWidth={1.4} />
            <line x1={280} y1={191} x2={280} y2={208} stroke="#c084fc" strokeWidth={1.6} />
            <PinTag x={288} y={206} text="CLR' (D4) → P3" align="start" color="#c084fc" />
            {/* J, CLK', K */}
            <line x1={140} y1={68} x2={195} y2={68} stroke="#60a5fa" strokeWidth={1.6} />
            <PinTag x={134} y={71} text="J (D0) → Pin 4" align="end" color="#60a5fa" />
            <line x1={140} y1={113} x2={190} y2={113} stroke="#fb923c" strokeWidth={1.6} />
            <circle cx={192} cy={113} r={3.5} fill="#0b1220" stroke="#fb923c" strokeWidth={1.4} />
            <polyline points="195,107 205,113 195,119" fill="none" stroke="#fb923c" strokeWidth={1.4} />
            <PinTag x={134} y={116} text="CLK' (D2) → Pin 1" align="end" color="#fb923c" />
            <line x1={140} y1={158} x2={195} y2={158} stroke="#60a5fa" strokeWidth={1.6} />
            <PinTag x={134} y={161} text="K (D1) → Pin 16" align="end" color="#60a5fa" />
            {/* Q, Q' */}
            <line x1={365} y1={80} x2={430} y2={80} stroke="#22c55e" strokeWidth={2} />
            <PinTag x={436} y={83} text="1Q (Pin 15) → D8" align="start" color="#4ade80" />
            <circle cx={369} cy={146} r={3.5} fill="#0b1220" stroke="#22c55e" strokeWidth={1.4} />
            <line x1={373} y1={146} x2={430} y2={146} stroke="#22c55e" strokeWidth={2} />
            <PinTag x={436} y={149} text="1Q' (Pin 14) → D9" align="start" color="#4ade80" />
            <PinTag x={90} y={208} text="Power: Pin 5 = +5V, Pin 13 = GND" align="start" color="#f87171" />
          </g>
        );

      case 'exp-d-flipflop':
        return (
          <g>
            <ICBlock x={195} y={40} w={170} h={146} title="IC 7474" subtitle="Rising-Edge D FF" />
            <line x1={280} y1={14} x2={280} y2={36} stroke="#c084fc" strokeWidth={1.6} />
            <circle cx={280} cy={38} r={3.5} fill="#0b1220" stroke="#c084fc" strokeWidth={1.4} />
            <PinTag x={288} y={24} text="PRE' (D2) → Pin 4" align="start" color="#c084fc" />
            <circle cx={280} cy={188} r={3.5} fill="#0b1220" stroke="#c084fc" strokeWidth={1.4} />
            <line x1={280} y1={191} x2={280} y2={208} stroke="#c084fc" strokeWidth={1.6} />
            <PinTag x={288} y={206} text="CLR' (D3) → Pin 1" align="start" color="#c084fc" />
            <line x1={140} y1={82} x2={195} y2={82} stroke="#60a5fa" strokeWidth={1.6} />
            <PinTag x={134} y={85} text="D (D0) → Pin 2" align="end" color="#60a5fa" />
            <line x1={140} y1={142} x2={195} y2={142} stroke="#fb923c" strokeWidth={1.6} />
            <polyline points="195,136 205,142 195,148" fill="none" stroke="#fb923c" strokeWidth={1.5} />
            <PinTag x={134} y={145} text="CLK (D1) ↑ → Pin 3" align="end" color="#fb923c" />
            <line x1={365} y1={82} x2={430} y2={82} stroke="#22c55e" strokeWidth={2} />
            <PinTag x={436} y={85} text="1Q (Pin 5) → D8" align="start" color="#4ade80" />
            <circle cx={369} cy={142} r={3.5} fill="#0b1220" stroke="#22c55e" strokeWidth={1.4} />
            <line x1={373} y1={142} x2={430} y2={142} stroke="#22c55e" strokeWidth={2} />
            <PinTag x={436} y={145} text="1Q' (Pin 6) → D9" align="start" color="#4ade80" />
            <PinTag x={88} y={208} text="Pin 14 = +5V, Pin 7 = GND" align="start" color="#94a3b8" />
          </g>
        );

      case 'exp-t-flipflop':
        return (
          <g>
            <ICBlock x={195} y={40} w={170} h={146} title="IC 7476" subtitle="T FF (J = K = T)" />
            <line x1={280} y1={14} x2={280} y2={36} stroke="#ef4444" strokeWidth={1.6} />
            <circle cx={280} cy={38} r={3.5} fill="#0b1220" stroke="#ef4444" strokeWidth={1.4} />
            <PinTag x={288} y={24} text="PRE' (+5V) → Pin 2" align="start" color="#f87171" />
            <circle cx={280} cy={188} r={3.5} fill="#0b1220" stroke="#c084fc" strokeWidth={1.4} />
            <line x1={280} y1={191} x2={280} y2={208} stroke="#c084fc" strokeWidth={1.6} />
            <PinTag x={288} y={206} text="CLR' (D2) → Pin 3" align="start" color="#c084fc" />
            <PinTag x={94} y={71} text="T (D0)" align="end" color="#60a5fa" />
            <line x1={100} y1={68} x2={150} y2={68} stroke="#60a5fa" strokeWidth={1.6} />
            <circle cx={150} cy={68} r={3} fill="#60a5fa" />
            <line x1={150} y1={68} x2={195} y2={68} stroke="#60a5fa" strokeWidth={1.6} />
            <polyline points="150,68 150,158 195,158" fill="none" stroke="#60a5fa" strokeWidth={1.6} />
            <PinTag x={172} y={62} text="1J (P4)" color="#93c5fd" />
            <PinTag x={172} y={152} text="1K (P16)" color="#93c5fd" />
            <line x1={115} y1={113} x2={190} y2={113} stroke="#fb923c" strokeWidth={1.6} />
            <circle cx={192} cy={113} r={3.5} fill="#0b1220" stroke="#fb923c" strokeWidth={1.4} />
            <PinTag x={108} y={116} text="CLK' (D1) → P1" align="end" color="#fb923c" />
            <line x1={365} y1={80} x2={430} y2={80} stroke="#22c55e" strokeWidth={2} />
            <PinTag x={436} y={83} text="Q (P15) = f/2 → D8" align="start" color="#4ade80" />
            <circle cx={369} cy={146} r={3.5} fill="#0b1220" stroke="#22c55e" strokeWidth={1.4} />
            <line x1={373} y1={146} x2={430} y2={146} stroke="#22c55e" strokeWidth={2} />
            <PinTag x={436} y={149} text="Q' (P14) → D9" align="start" color="#4ade80" />
          </g>
        );

      case 'exp-ring-counter':
      case 'exp-johnson-counter': {
        const isJohnson = experimentId === 'exp-johnson-counter';
        return (
          <g>
            <ICBlock x={60} y={40} w={110} h={96} title="FF1 (Q2)" subtitle="IC1 · 7474 (1/2)" />
            <ICBlock x={220} y={40} w={110} h={96} title="FF2 (Q1)" subtitle="IC1 · 7474 (2/2)" />
            <ICBlock x={380} y={40} w={110} h={96} title="FF3 (Q0)" subtitle="IC2 · 7474 (1/2)" />
            {/* Shift arrows */}
            <line x1={170} y1={66} x2={220} y2={66} stroke="#eab308" strokeWidth={1.8} />
            <line x1={330} y1={66} x2={380} y2={66} stroke="#eab308" strokeWidth={1.8} />
            {/* Outputs */}
            <line x1={195} y1={66} x2={195} y2={28} stroke="#22c55e" strokeWidth={1.5} />
            <PinTag x={195} y={20} text="Q2→D8" color="#4ade80" />
            <line x1={355} y1={66} x2={355} y2={28} stroke="#22c55e" strokeWidth={1.5} />
            <PinTag x={355} y={20} text="Q1→D9" color="#4ade80" />
            <line x1={490} y1={66} x2={526} y2={66} stroke="#22c55e" strokeWidth={1.8} />
            <PinTag x={530} y={70} text="Q0→D10" align="start" color="#4ade80" />
            {/* Feedback loop */}
            <polyline
              points={isJohnson ? '490,108 516,108 516,164 36,164 36,66 60,66' : '508,66 508,164 36,164 36,66 60,66'}
              fill="none"
              stroke={isJohnson ? '#f43f5e' : '#eab308'}
              strokeWidth={1.7}
            />
            <PinTag
              x={275}
              y={178}
              text={isJohnson ? "Twisted Feedback: Q0' (IC2 Pin 6) → D2 (IC1 Pin 2)" : 'Ring Feedback: Q0 (IC2 Pin 5) → D2 (IC1 Pin 2)'}
              color={isJohnson ? '#fb7185' : '#fde047'}
            />
            {/* Common CLK & ORI' */}
            <polyline points="24,196 115,196 115,136" fill="none" stroke="#fb923c" strokeWidth={1.4} />
            <polyline points="115,196 275,196 275,136" fill="none" stroke="#fb923c" strokeWidth={1.4} />
            <polyline points="275,196 435,196 435,136" fill="none" stroke="#fb923c" strokeWidth={1.4} />
            <PinTag x={26} y={210} text="CLK (D0) → IC1 P3, P11 & IC2 P3   |   ORI' (D1) → Init 100 / 000" align="start" color="#fb923c" />
          </g>
        );
      }

      case 'exp-decade-counter':
        return (
          <g>
            <ICBlock x={195} y={36} w={175} h={148} title="IC 74LS90" subtitle="Mod-2 + Mod-5 BCD" />
            <line x1={120} y1={66} x2={195} y2={66} stroke="#fb923c" strokeWidth={1.8} />
            <PinTag x={114} y={69} text="CLK (D0) → CKA (P14)" align="end" color="#fb923c" />
            <line x1={120} y1={134} x2={195} y2={134} stroke="#c084fc" strokeWidth={1.6} />
            <PinTag x={114} y={137} text="MR (D1) → R0(1,2) P2,P3" align="end" color="#c084fc" />
            <line x1={120} y1={164} x2={195} y2={164} stroke="#64748b" strokeWidth={1.5} />
            <PinTag x={114} y={167} text="GND → R9(1,2) P6,P7" align="end" color="#94a3b8" />
            {/* QA -> CKB external bridge */}
            <polyline points="370,60 400,60 400,22 160,22 160,96 195,96" fill="none" stroke="#eab308" strokeWidth={1.6} />
            <PinTag x={282} y={16} text="External Bridge: QA (Pin 12) → CKB (Pin 1)" color="#fde047" />
            {/* Outputs */}
            {[
              { y: 60, lbl: 'QA (Pin 12) → D8 (LSB)' },
              { y: 92, lbl: 'QB (Pin 9) → D9' },
              { y: 124, lbl: 'QC (Pin 8) → D10' },
              { y: 156, lbl: 'QD (Pin 11) → D11 (MSB)' },
            ].map((o, i) => (
              <g key={i}>
                <line x1={370} y1={o.y} x2={425} y2={o.y} stroke="#22c55e" strokeWidth={1.8} />
                <PinTag x={432} y={o.y + 3} text={o.lbl} align="start" color="#4ade80" />
              </g>
            ))}
            <PinTag x={282} y={206} text="Non-Standard Power: Pin 5 = +5V (VCC), Pin 10 = GND" color="#f87171" />
          </g>
        );

      case 'exp-encoder':
        return (
          <g>
            <ICBlock x={185} y={28} w={175} h={176} title="IC 74148" subtitle="8:3 Priority Encoder" />
            {[
              { y: 44, lbl: '0\' (D0) → Pin 10' },
              { y: 64, lbl: '1\' (D1) → Pin 11' },
              { y: 84, lbl: '2\' (D2) → Pin 12' },
              { y: 104, lbl: '3\' (D3) → Pin 13' },
              { y: 124, lbl: '4\' (D4) → Pin 1' },
              { y: 144, lbl: '5\' (D5) → Pin 2' },
              { y: 164, lbl: '6\' (D6) → Pin 3' },
              { y: 184, lbl: '7\' (D7) → Pin 4 [MAX PRIO]' },
            ].map((item, i) => (
              <g key={i}>
                <line x1={140} y1={item.y} x2={181} y2={item.y} stroke="#60a5fa" strokeWidth={1.5} />
                <circle cx={183} cy={item.y} r={2.8} fill="#0b1220" stroke="#60a5fa" strokeWidth={1.3} />
                <PinTag x={134} y={item.y + 3} text={item.lbl} align="end" color="#60a5fa" />
              </g>
            ))}
            <PinTag x={272} y={20} text="Pin 16 = +5V  |  Pin 8 = GND  |  EI' (Pin 5) = GND" color="#fbbf24" />
            {[
              { y: 54, lbl: 'A0\' (Pin 9) → D8' },
              { y: 88, lbl: 'A1\' (Pin 7) → D9' },
              { y: 122, lbl: 'A2\' (Pin 6) → D10' },
              { y: 156, lbl: 'GS\' (Pin 14) → D11' },
              { y: 186, lbl: 'EO\' (Pin 15) → D12' },
            ].map((o, i) => (
              <g key={i}>
                <circle cx={364} cy={o.y} r={3.2} fill="#0b1220" stroke="#22c55e" strokeWidth={1.4} />
                <line x1={368} y1={o.y} x2={422} y2={o.y} stroke="#22c55e" strokeWidth={1.7} />
                <PinTag x={428} y={o.y + 3} text={o.lbl} align="start" color="#4ade80" />
              </g>
            ))}
          </g>
        );

      case 'exp-demultiplexer':
      default:
        return (
          <g>
            <ICBlock x={190} y={32} w={175} h={164} title="IC 74139" subtitle="1:4 Demux (Section A)" />
            <line x1={135} y1={68} x2={186} y2={68} stroke="#fbbf24" strokeWidth={1.8} />
            <circle cx={188} cy={68} r={3.5} fill="#0b1220" stroke="#fbbf24" strokeWidth={1.4} />
            <PinTag x={128} y={71} text="Data/Ea' (D0) → Pin 1" align="end" color="#fbbf24" />
            <line x1={135} y1={118} x2={190} y2={118} stroke="#c084fc" strokeWidth={1.6} />
            <PinTag x={128} y={121} text="S0 (D1) → Pin 2" align="end" color="#c084fc" />
            <line x1={135} y1={154} x2={190} y2={154} stroke="#c084fc" strokeWidth={1.6} />
            <PinTag x={128} y={157} text="S1 (D2) → Pin 3" align="end" color="#c084fc" />
            {[
              { y: 58, lbl: 'Y0\' (Pin 4) → D8' },
              { y: 94, lbl: 'Y1\' (Pin 5) → D9' },
              { y: 130, lbl: 'Y2\' (Pin 6) → D10' },
              { y: 166, lbl: 'Y3\' (Pin 7) → D11' },
            ].map((o, i) => (
              <g key={i}>
                <circle cx={369} cy={o.y} r={3.5} fill="#0b1220" stroke="#22c55e" strokeWidth={1.4} />
                <line x1={373} y1={o.y} x2={428} y2={o.y} stroke="#22c55e" strokeWidth={1.8} />
                <PinTag x={434} y={o.y + 3} text={o.lbl} align="start" color="#4ade80" />
              </g>
            ))}
            <PinTag x={278} y={20} text="Pin 16 = +5V (VCC)  |  Pin 8 = GND" color="#94a3b8" />
          </g>
        );
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-x-auto">
      <svg viewBox="0 0 600 220" className="w-full max-w-[660px] mx-auto h-auto select-none">
        <rect x={0} y={0} width={600} height={220} rx={6} fill="#020617" />
        {renderDiagram()}
      </svg>
    </div>
  );
};
