// Author: https://gourav.io/blog/react-tooltip-component //
import { forwardRef, useEffect, useRef } from "react";

/**
 * content: use `<br/>` to break lines so that tooltip is not too wide
 * @returns
 */
export const Tooltip = ({ clients, content, children, hover, setHover, leave }) => {
  const hoverTimeout = useRef(null);
  const tooltipContentRef = useRef(null);
  const triangleRef = useRef(null);
  const triangleInvertedRef = useRef(null);
  const tooltipRef = useRef(null);
  const delay = 300;

  const handleMouseEnter = () => {
    if (leave) {
      clearTimeout(leave);
      leave = null;
    }

    hoverTimeout.current = setTimeout(() => {
      setHover(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    leave = setTimeout(() => {
      setHover(false);
    }, delay);
  };

  const updateTooltipPosition = () => {
    if (tooltipContentRef.current && tooltipRef.current && triangleRef.current && triangleInvertedRef.current) {
      const rect = tooltipContentRef.current.getBoundingClientRect();

      let { top, left, right } = rect;
      const padding = 40;

      // overflowing from left side
      if (left < 0 + padding) {
        const newLeft = Math.abs(left) + padding;
        tooltipContentRef.current.style.left = `${newLeft}px`;
      }
      // overflowing from right side
      else if (right + padding > window.innerWidth) {
        const newRight = right + padding - window.innerWidth;
        tooltipContentRef.current.style.right = `${newRight}px`;
      }

      // overflowing from top side
      if (top < 0) {
        // unset top and set bottom
        tooltipRef.current.style.top = "unset";
        tooltipRef.current.style.bottom = "0";
        tooltipRef.current.style.transform = "translateY(calc(100% + 10px))";
        triangleInvertedRef.current.style.display = "none";
        triangleRef.current.style.display = "block";
      }
    }
  };

  // Update position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (hover) {
        updateTooltipPosition();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [hover]);

  if (clients === 0) {
    return <div className="relative inline-flex flex-col items-center">{children}</div>;
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex flex-col items-center"
    >
      {hover && (
        <div
          ref={tooltipRef}
          className="absolute left-0 top-0 mx-auto flex w-full items-center justify-center gap-0  [transform:translateY(calc(-100%-10px))] [z-index:999999]"
        >
          <div className="mx-auto flex w-0 flex-col items-center justify-center text-slate-800">
            <TriangleFilled ref={triangleRef} style={{ marginBottom: "-7px", display: "none" }} />

            <div
              ref={tooltipContentRef}
              className="relative whitespace-nowrap rounded-md bg-slate-800 border border-white p-2.5 text-[14px] leading-relaxed tracking-wide  text-white shadow-sm [font-weight:400]"
            >
              {content}
            </div>

            <TriangleInvertedFilled ref={triangleInvertedRef} style={{ marginTop: "-7px" }} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

const TriangleInvertedFilled = forwardRef((props, ref) => {
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M0 0h24v24H0z"></path>
        <path
          fill="white"
          d="M20.118 3H3.893A2.914 2.914 0 0 0 1.39 7.371L9.506 20.92a2.917 2.917 0 0 0 4.987.005l8.11-13.539A2.914 2.914 0 0 0 20.117 3z"
        ></path>
      </g>
    </svg>
  );
});
TriangleInvertedFilled.displayName = "TriangleInvertedFilled";

const TriangleFilled = forwardRef((props, ref) => {
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M0 0h24v24H0z"></path>
        <path
          fill="white"
          d="M12 1.67a2.914 2.914 0 0 0-2.492 1.403L1.398 16.61a2.914 2.914 0 0 0 2.484 4.385h16.225a2.914 2.914 0 0 0 2.503-4.371L14.494 3.078A2.917 2.917 0 0 0 12 1.67"
        ></path>
      </g>
    </svg>
  );
});

TriangleFilled.displayName = "TriangleFilled";
