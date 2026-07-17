const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionController');

router.post('/:articleId/react', reactionController.toggleReaction);
router.get('/:articleId/counts', reactionController.getCounts);

module.exports = router;