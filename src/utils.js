// Local poster used when an online image can't be loaded
export const posterFallback = (title) =>
  `/posters/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.svg`;
