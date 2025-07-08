const ScrollToUp = () => {
  return(
    <div
        className="scroll-to-top-container"
        onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          zIndex: 1000,
          cursor: "pointer",
        }}
        aria-label="Scroll to top"
      >
        <div className="scroll-to-top-circle">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="14" cy="14" r="14" fill="#65b7f6" />
            <path
              d="M14 20V8"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M8 14L14 8L20 14"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
  )
}

export default ScrollToUp;
