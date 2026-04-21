import { useReducer, useCallback } from 'react';
import { scenes, questions, determineEnding } from '../data/dialogueData';

/**
 * Game phases:
 * - INTRO: Playing through intro scenes
 * - QUESTION: Active question with choices
 * - CHILD_RESPONSE: Showing child's reaction to choice
 * - ENDING_TRANSITION: Transitioning to ending (child fading)
 * - ENDING: Showing the ending scene
 */

const PHASES = {
  INTRO: 'INTRO',
  QUESTION: 'QUESTION',
  CHILD_RESPONSE: 'CHILD_RESPONSE',
  ENDING_TRANSITION: 'ENDING_TRANSITION',
  ENDING: 'ENDING',
};

const initialState = {
  phase: PHASES.INTRO,
  sceneIndex: 0,
  dialogueIndex: 0,
  questionIndex: 0,
  innerScore: 0,
  outerScore: 0,
  history: [],
  showChoices: false,
  ending: null,
  lastChoice: null,
  isTransitioning: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'ADVANCE_DIALOGUE': {
      const currentScene = scenes[state.sceneIndex];
      if (!currentScene) return state;

      const nextDialogueIndex = state.dialogueIndex + 1;

      // If there are more dialogues in this scene
      if (nextDialogueIndex < currentScene.dialogues.length) {
        const dialogue = currentScene.dialogues[nextDialogueIndex];
        return {
          ...state,
          dialogueIndex: nextDialogueIndex,
          history: [
            ...state.history,
            {
              id: `scene-${state.sceneIndex}-${nextDialogueIndex}`,
              speaker: dialogue.speaker,
              text: dialogue.text,
            },
          ],
        };
      }

      // Move to next scene
      const nextSceneIndex = state.sceneIndex + 1;
      if (nextSceneIndex < scenes.length) {
        const nextScene = scenes[nextSceneIndex];
        const firstDialogue = nextScene.dialogues[0];
        return {
          ...state,
          sceneIndex: nextSceneIndex,
          dialogueIndex: 0,
          history: [
            ...state.history,
            {
              id: `scene-${nextSceneIndex}-0`,
              speaker: firstDialogue.speaker,
              text: firstDialogue.text,
            },
          ],
        };
      }

      // All intro scenes done → first question
      const firstQuestion = questions[0];
      return {
        ...state,
        phase: PHASES.QUESTION,
        questionIndex: 0,
        showChoices: true,
        history: [
          ...state.history,
          {
            id: `q-${firstQuestion.id}-prompt`,
            speaker: 'child',
            text: firstQuestion.childPrompt,
          },
        ],
      };
    }

    case 'START_GAME': {
      // Add first dialogue of first scene
      const firstScene = scenes[0];
      const firstDialogue = firstScene.dialogues[0];
      return {
        ...state,
        history: [
          {
            id: 'scene-0-0',
            speaker: firstDialogue.speaker,
            text: firstDialogue.text,
          },
        ],
      };
    }

    case 'SELECT_CHOICE': {
      const { choice } = action.payload;
      const currentQuestion = questions[state.questionIndex];

      return {
        ...state,
        phase: PHASES.CHILD_RESPONSE,
        showChoices: false,
        innerScore: state.innerScore + (choice.scoreInner || 0),
        outerScore: state.outerScore + (choice.scoreOuter || 0),
        lastChoice: choice,
        history: [
          ...state.history,
          {
            id: `q-${currentQuestion.id}-answer`,
            speaker: 'player',
            text: choice.text,
          },
          {
            id: `q-${currentQuestion.id}-response`,
            speaker: 'child',
            text: choice.response,
          },
        ],
      };
    }

    case 'NEXT_QUESTION': {
      const nextQuestionIndex = state.questionIndex + 1;

      // All questions answered → transition to ending
      if (nextQuestionIndex >= questions.length) {
        const ending = determineEnding(state.innerScore, state.outerScore);
        return {
          ...state,
          phase: PHASES.ENDING_TRANSITION,
          ending,
          isTransitioning: true,
          history: [
            ...state.history,
            {
              id: 'transition-narration',
              speaker: 'narration',
              text: '[ เด็กน้อยยิ้มให้คุณเป็นครั้งสุดท้าย... แล้วค่อยๆ จางหายไป ]',
            },
          ],
        };
      }

      // Next question
      const nextQuestion = questions[nextQuestionIndex];
      return {
        ...state,
        phase: PHASES.QUESTION,
        questionIndex: nextQuestionIndex,
        showChoices: true,
        lastChoice: null,
        history: [
          ...state.history,
          {
            id: `q-${nextQuestion.id}-prompt`,
            speaker: 'child',
            text: nextQuestion.childPrompt,
          },
        ],
      };
    }

    case 'SHOW_ENDING': {
      return {
        ...state,
        phase: PHASES.ENDING,
        isTransitioning: false,
      };
    }

    case 'RESET': {
      return { ...initialState };
    }

    default:
      return state;
  }
}

export function useGameEngine() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const advanceDialogue = useCallback(() => {
    dispatch({ type: 'ADVANCE_DIALOGUE' });
  }, []);

  const selectChoice = useCallback((choice) => {
    dispatch({ type: 'SELECT_CHOICE', payload: { choice } });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const showEnding = useCallback(() => {
    dispatch({ type: 'SHOW_ENDING' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    PHASES,
    startGame,
    advanceDialogue,
    selectChoice,
    nextQuestion,
    showEnding,
    resetGame,
  };
}
