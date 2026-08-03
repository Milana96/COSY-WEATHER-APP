const express = require('express');
const { runRagQuery } = require('../ragService');

const router = express.Router();

router.post('/query', async (req, res) => {
  try {
    const { question, city, weather } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const result = await runRagQuery(question.trim(), city, weather);
    return res.json(result);
  } catch (error) {
    console.error('RAG query failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to answer question' });
  }
});

module.exports = router;
