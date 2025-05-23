// // Code courtesy of Josh Comeau
// 'use client';
// import * as React from 'react';
// import styled from '@emotion/styled';
// import { keyframes } from '@emotion/react';
// import { FComp } from '@/types/common';
// import { random } from '@/utils/utils';
// import { useRandomInterval } from '@/hooks/useRandomInterval';

// const DEFAULT_COLOR = '#FFC700';
// const range = (end: number, start = 0, step = 1) => {
//   let output = [];
//   for (let i = start; i < end; i += step) {
//     output.push(i);
//   }
//   return output;
// };

// const generateSparkle = (color: string) => {
//   const sparkle = {
//     id: String(random(10000, 99999)),
//     createdAt: Date.now(),
//     color,
//     size: random(10, 20),
//     style: {
//       top: random(0, 100) - 20 + '%',
//       left: random(0, 100) - 10 + '%'
//     }
//   };
//   return sparkle;
// };

// type SparklesProps = {
//   color?: string;
// };
// const Sparkles: FComp<SparklesProps> = ({
//   color = DEFAULT_COLOR,
//   children
// }) => {
//   const [sparkles, setSparkles] = React.useState(() => {
//     return range(3).map(() => generateSparkle(color));
//   });
//   const [isLoaded, setIsLoaded] = React.useState(false);

//   React.useEffect(() => {
//     setIsLoaded(true);
//   }, []);

//   useRandomInterval(
//     () => {
//       const sparkle = generateSparkle(color);
//       const now = Date.now();
//       const nextSparkles = sparkles.filter((sp) => {
//         const delta = now - sp.createdAt;
//         return delta < 750;
//       });
//       nextSparkles.push(sparkle);
//       setSparkles(nextSparkles);
//     },
//     1000,
//     900
//   );
//   return (
//     <Wrapper>
//       {isLoaded
//         ? sparkles.map((sparkle) => (
//             <Sparkle
//               key={sparkle.id}
//               color={sparkle.color}
//               size={sparkle.size}
//               style={sparkle.style}
//             />
//           ))
//         : null}
//       <ChildWrapper>{children}</ChildWrapper>
//     </Wrapper>
//   );
// };

// type SparkleProps = {
//   size: number;
//   color: string;
//   style: React.CSSProperties;
// };
// const Sparkle: FComp<SparkleProps> = ({ size, color, style }) => {
//   const path =
//     'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z';
//   return (
//     <SparkleWrapper style={style}>
//       <SparkleSvg width={size} height={size} viewBox="0 0 68 68" fill="none">
//         <path d={path} fill={color} />
//       </SparkleSvg>
//     </SparkleWrapper>
//   );
// };

// const comeInOut = keyframes`
//   0% {
//     transform: scale(0);
//   }
//   50% {
//     transform: scale(1);
//   }
//   100% {
//     transform: scale(0);
//   }
// `;
// const spin = keyframes`
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(180deg);
//   }
// `;

// const Wrapper = styled.span`
//   display: inline-block;
//   position: relative;
// `;

// const SparkleWrapper = styled.span`
//   position: absolute;
//   display: block;
//   @media (prefers-reduced-motion: no-preference) {
//     animation: ${comeInOut} 700ms forwards;
//   }
// `;

// const SparkleSvg = styled.svg`
//   display: block;
//   @media (prefers-reduced-motion: no-preference) {
//     animation: ${spin} 1000ms linear;
//   }
// `;

// const ChildWrapper = styled.strong`
//   position: relative;
//   z-index: 1;
//   font-weight: bold;
// `;

// export default Sparkles;
