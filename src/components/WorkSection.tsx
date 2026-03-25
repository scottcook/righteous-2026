"use client";

export default function WorkSection() {
  return (
    <section className="relative z-10 min-h-screen" data-theme="light" style={{ backgroundColor: "rgb(246, 246, 246)" }}>
      <div style={{ paddingTop: "76px", paddingLeft: "38px", paddingRight: "38px" }}>
        <p
          style={{
            fontSize: "clamp(36px, 4.9vw, 71px)",
            fontWeight: 400,
            lineHeight: "113%",
            letterSpacing: "-0.06em",
            color: "#000000",
            maxWidth: "1105px",
          }}
        >
          A small team of product and agency veterans, partnering with brands and startups to build immersive websites and products.
        </p>
      </div>
    </section>
  );
}
