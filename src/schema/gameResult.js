/**
 * gameResult.js — MongoDB/Mongoose Schema (prepared, not wired)
 *
 * This schema is production-ready for storing game results.
 * To use, install mongoose and connect to a MongoDB instance.
 *
 * Usage:
 *   import mongoose from 'mongoose';
 *   import { GameResultSchema } from './gameResult';
 *   const GameResult = mongoose.model('GameResult', GameResultSchema);
 */

const GameResultSchema = {
  // UUID v4 for shareable link
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  // Player scores
  innerScore: {
    type: Number,
    required: true,
    min: 0,
    max: 12,
  },
  outerScore: {
    type: Number,
    required: true,
    min: 0,
    max: 8,
  },

  // Ending info
  endingNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  endingTitle: {
    type: String,
    required: true,
  },
  endingTitleEN: {
    type: String,
    required: true,
  },

  // Array of 6 choices made
  choices: [
    {
      questionIndex: { type: Number, required: true },
      choiceKey: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
      choiceText: { type: String, required: true },
    },
  ],

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userAgent: {
    type: String,
  },
};

export { GameResultSchema };
