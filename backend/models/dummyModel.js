export const dummyModel = {
  generateLayout(theme, budget, audienceSize) {
    return {
      layoutName: `${theme} Stage Layout`,
      lighting: audienceSize > 100 ? "High intensity LED setup" : "Compact lighting rig",
      props: ["Main Stage", "Backdrop", "Truss System"],
      estimatedCost: budget * 0.9,
      confidence: Math.random().toFixed(2),
    };
  }
};
