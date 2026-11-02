import React from 'react';

// Editable pencil studies: deliberately offset contours, construction marks and hatching.
function Pencil({ d, light = false, copies = 2 }) {
  return <g className={light ? 'pencil-line light' : 'pencil-line'}>{Array.from({ length: copies }, (_, i) => <path key={i} d={d} transform={`translate(${i * 1.15} ${i * -.65})`} opacity={i ? .28 : .75} />)}</g>;
}
export function ComputerDrawing() {
  return <svg viewBox="0 0 500 420" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M61 31L417 42L439 292L40 302Z" fill="var(--desk-paper)" /><Pencil d="M61 31L417 42L439 292L40 302L61 31 M417 42L454 66L472 277L439 292 M73 52L399 60L414 253L59 261Z" />
    <path d="M83 68L387 75L399 239L72 246Z" fill="var(--screen-paper)" /><Pencil d="M83 68L387 75L399 239L72 246Z M61 270L415 263 M106 305L104 325L354 319L359 297 M37 340L394 325L475 380L10 400Z M10 400L16 411L480 391L475 380" />
    <Pencil light d="M432 80L452 270 M437 87L456 265 M443 99L460 253 M447 116L463 246 M56 39L43 274 M65 307L412 298 M23 404L464 386 M24 393L453 374" />
    {Array.from({length:5},(_,row)=><Pencil key={row} light d={`M${54-row*6} ${349+row*8}L${386+row*12} ${335+row*8}`} />)}
    {Array.from({length:20},(_,i)=><path key={i} d={`M${63+i*16} 342l${i*.55-8} 40`} opacity=".22" />)}
    <Pencil d="M373 279l7 -1 M390 279l8 -1" /><circle cx="76" cy="280" r="4" /><path d="M325 365l60 -3l21 12l-92 5Z" />
  </g></svg>;
}
export function CompareDrawing() {
  return <svg viewBox="0 0 330 220" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"><path d="M25 45L165 24L189 183L45 207Z" fill="var(--desk-paper)"/><path d="M139 21L299 37L285 202L124 185Z" fill="var(--desk-paper)"/><Pencil d="M25 45L165 24L189 183L45 207Z M139 21L299 37L285 202L124 185Z M48 77L130 65 M51 91L117 82 M149 59L278 72 M146 75L253 86 M138 153L271 168 M136 165L234 177"/><Pencil light d="M19 52L40 211L176 190 M303 45L289 207L129 193 M150 31L287 44"/><path d="M61 39q-8-29 4-29q12 0 5 28q-5 8-7 0l2-23"/><path d="M253 28q-9-22 1-25q11-1 6 28"/></g></svg>;
}
export function DrawerDrawing() {
  return <svg viewBox="0 0 350 220" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"><path d="M19 50L291 36L335 75L56 101Z" fill="var(--screen-paper)"/><path d="M56 101L335 75L328 199L57 214Z" fill="var(--desk-paper)"/><Pencil d="M19 50L291 36L335 75L328 199L57 214L56 101L19 50Z M56 101L335 75 M23 51L24 172L56 203 M123 115L249 107L248 166L124 175Z M160 172L217 167L217 180L162 184Z"/><Pencil light d="M67 207L320 194 M66 106L66 196 M29 61L29 164 M297 54L43 71 M305 62L47 83 M312 68L48 91"/><Pencil d="M69 51L65 21L128 17L143 35L243 30L254 44 M77 54L78 31L117 27 M91 52L94 38L236 34"/></g></svg>;
}
export default function DeskDrawing() {
  return <svg className="desk-drawing" viewBox="0 0 1440 850" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="pencil-window"><path d="M682 25L1220 48L1200 310L678 295Z" /></clipPath></defs><g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
    <Pencil light d="M37 12L42 580 M52 3L55 550 M1368 13L1356 586 M59 574L1361 558 M62 578L1354 565" />
    <Pencil d="M660 8L1237 34L1222 330L654 311Z M682 25L1220 48L1200 310L678 295Z M940 40L930 309 M680 170L1209 184" />
    <g clipPath="url(#pencil-window)" opacity=".57"><Pencil d="M673 293L675 227L718 230L718 184L751 183L753 282 M764 290L765 150L811 152L812 293 M826 295L828 213L872 208L877 295 M890 294L890 161L904 162L906 119L918 117L920 72L923 118L938 121L940 162L951 165L950 297 M970 300L971 228L1002 227L1005 185L1047 185L1049 301 M1072 305L1072 136L1117 137L1124 306 M1144 305L1149 215L1189 209L1189 294"/>
    {Array.from({length:34},(_,i)=><path key={i} d={`M${699+i*15} ${195+(i%5)*18}l-1 ${12+i%3*9} M${703+i*15} ${249+i%4*11}l-1 21`} opacity=".35" />)}
    {Array.from({length:18},(_,i)=><path className="pencil-rain" key={`rain${i}`} d={`M${696+i*28} ${45+i%4*18}l-7 ${23+i%3*16}`} style={{animationDelay:`${-i*.4}s`}} opacity=".25" />)}</g>
    <Pencil light d="M668 322L1212 343 M675 331L1194 351 M84 573L1272 549L1393 740L123 781L84 573 M123 781L128 798L1395 756L1393 740 M126 797L129 846 M1278 767L1282 839 M1360 761L1365 840" />
    <Pencil d="M84 573L1272 549L1393 740L123 781L84 573 M123 781L128 798L1395 756L1393 740" />
    <Pencil light d="M150 765L1365 731 M157 751L1350 716 M110 600L1284 573 M119 610L1290 582 M132 653L1314 627" />
    <Pencil d="M1002 574L1080 568L1101 581L1011 591Z M1040 567L1070 367 M1070 367L1014 312L1084 242L1151 312L1070 367 M1014 312Q1080 305 1151 312 M1081 243L1056 212L1005 225" />
    <Pencil light d="M1048 563L1077 374 M1079 253L1118 306 M1087 260L1128 306 M1095 268L1137 307 M1066 251L1026 304 M1044 575L1082 579" />
    <Pencil d="M152 656L286 634L360 673L213 699Z M161 663L270 645 M168 670L264 654 M180 676L256 665 M657 707L783 694L824 718L693 737Z" />
    <Pencil light d="M210 705L364 678 M651 712L692 742L826 724 M273 715l54 -22 M280 721l53 -22 M704 749L790 735" />
    <Pencil d="M1241 509q-21-13-34 6l1 57q18 14 36-2Z M1244 522q40-6 24 27q-9 9-24 6 M1209 516q17 10 33-5" />
    <Pencil light d="M1322 480l-16 -57 M1327 481l3-63 M1332 479l13-49 M1305 481L1347 479L1344 539L1310 542Z M1315 491l25 -2 M1318 500l22 -1" />
    <path d="M163 229q-44 28-45 79m0 0l-6-15m6 15l12-10" stroke="var(--accent)" strokeWidth="1.4"/><path d="M708 669q25-15 55-11" strokeDasharray="3 7" opacity=".5"/>
  </g></svg>;
}
