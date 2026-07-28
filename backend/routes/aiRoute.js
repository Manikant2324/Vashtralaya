import express from 'express';
import {
    semanticSearch,
    chatAssistant,
    getPersonalizedRecommendations,
    getSimilarProducts,
    getFrequentlyBoughtTogether,
    getSizeRecommendation,
    generateProductDescription,
    getReviewSentimentSummary
} from '../controllers/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/search', semanticSearch);
aiRouter.post('/chat', chatAssistant);
aiRouter.get('/recommendations', getPersonalizedRecommendations);
aiRouter.get('/similar/:productId', getSimilarProducts);
aiRouter.get('/frequently-bought-together/:productId', getFrequentlyBoughtTogether);
aiRouter.post('/size-fit', getSizeRecommendation);
aiRouter.post('/generate-description', generateProductDescription);
aiRouter.get('/review-summary/:productId', getReviewSentimentSummary);

export default aiRouter;
