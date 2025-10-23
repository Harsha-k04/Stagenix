import { dummyModel } from '../models/dummyModel.js';

export const getAIDesign = (req, res) => {
  const { theme, budget, audienceSize } = req.body;
  const result = dummyModel.generateLayout(theme, budget, audienceSize);
  res.json(result);
};
