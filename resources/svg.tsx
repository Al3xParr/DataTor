import React from "react";

export default function LandingPageGraphs() {

    return (

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="600"
            height="420"
            viewBox="0 0 600 420"
            role="img"
            aria-label="Varied minimalist charts with random data in green-blue palette"
            className="bg-bg shadow-md rounded-4xl "
        >
            <defs>
                <style>
                    {`
          .primary { fill: hsl(151,46%,47%); stroke: hsl(151,46%,47%); }
          .secondary { fill: hsl(190,100%,28%); stroke: hsl(190,100%,28%); }
          .grid { stroke: #e9eef0; stroke-width:1; }
          .axis { stroke: #cdd5d9; stroke-width:1.4; }
          .bg { fill: var(--color-bg-light); stroke: var(--color-txt-muted); rx:18; }
          .line { fill: none; stroke-width:2.5; stroke-linejoin:round; stroke-linecap:round; }
          .area { opacity:0.12; }
          .bar { rx:4; ry:4; }
        `}
                </style>
            </defs>

            {/* 1. Vertical bars */}
            <g transform="translate(20,20)" className="" >
                <rect className="bg" width="260" height="160"  />
                <g transform="translate(18,20)" >
                    <line className="axis" x1="0" y1="120" x2="224" y2="120" />
                    <line className="axis" x1="0" y1="0" x2="0" y2="120" />
                    <rect className="primary bar" x="10" y="78" width="16" height="42" />
                    <rect className="secondary bar" x="28" y="52" width="16" height="68" />
                    <rect className="primary bar" x="60" y="90" width="16" height="30" />
                    <rect className="secondary bar" x="78" y="30" width="16" height="90" />
                    <rect className="primary bar" x="110" y="60" width="16" height="60" />
                    <rect className="secondary bar" x="128" y="85" width="16" height="35" />
                    <rect className="primary bar" x="160" y="40" width="16" height="80" />
                    <rect className="secondary bar" x="178" y="25" width="16" height="95" />
                </g>
            </g>

            {/* 2. Line + shaded area */}
            <g transform="translate(320,20)" >
                <rect className="bg" width="260" height="160" radius={7} />
                <g transform="translate(15,20)" >
                    <line className="axis" x1="0" y1="120" x2="230" y2="120" />
                    <line className="axis" x1="0" y1="0" x2="0" y2="120" />
                    <polyline
                        className="line primary"
                        points="0,100 30,75 60,90 90,50 120,65 150,40 180,70 210,60 230,85"
                    />
                    <polyline
                        className="line secondary"
                        points="0,90 30,100 60,80 90,70 120,90 150,60 180,80 210,65 230,95"
                    />
                </g>
            </g>



            {/* 4. Horizontal bars */}
            <g transform="translate(20,220)" >
                <rect className="bg" width="260" height="160" radius={7} />
                <g transform="translate(130,80) scale(0.9)" >
                    <circle r="65" fill="none" className="axis" />
                    <circle r="45" fill="none" className="axis" />
                    <polygon
                        className="area primary"
                        points="0,-55 55,-25 60,5 35,50 -5,65 -45,20 -30,-45"
                    />
                    <polygon
                        className="area secondary"
                        opacity="0.08"
                        points="0,-45 40,-10 55,10 25,45 -10,55 -50,25 -35,-35"
                    />
                    <polyline
                        className="line primary"
                        points="0,-55 55,-25 60,5 35,50 -5,65 -45,20 -30,-45 0,-55"
                    />
                    <polyline
                        className="line secondary"
                        points="0,-45 40,-10 55,10 25,45 -10,55 -50,25 -35,-35 0,-45"
                    />
                </g>
            </g>

            {/* 5. Multi-line overlapping */}
            <g transform="translate(320,220)" >
                <rect className="bg" width="260" height="160" radius={7} />
                <g transform="translate(20,20)" >
                    <line className="axis" x1="0" y1="120" x2="220" y2="120" />
                    <line className="axis" x1="0" y1="0" x2="0" y2="120" />
                    <rect className="primary bar" x="0" y="10" width="130" height="16" />
                    <rect className="secondary bar" x="0" y="36" width="90" height="16" />
                    <rect className="primary bar" x="0" y="62" width="180" height="16" />
                    <rect className="secondary bar" x="0" y="88" width="210" height="16" />
                </g>
            </g>

        </svg >


    )

}