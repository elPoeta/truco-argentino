import {
  POS_PLAYED_CARD_0_X,
  POS_PLAYED_CARD_0_Y,
  POS_PLAYED_CARD_1_X,
  POS_PLAYED_CARD_1_Y,
  POS_PLAYED_CARD_2_X,
  POS_PLAYED_CARD_2_Y,
  POS_PLAYED_CARD_3_X,
  POS_PLAYED_CARD_3_Y,
  POS_PLAYED_CARD_4_X,
  POS_PLAYED_CARD_4_Y,
  POS_PLAYED_CARD_5_X,
  POS_PLAYED_CARD_5_Y,
} from "./helpers.js";

export const playedCardCoords = {
  0: {
    x: POS_PLAYED_CARD_0_X,
    y: POS_PLAYED_CARD_0_Y,
  },
  1: {
    x: POS_PLAYED_CARD_1_X,
    y: POS_PLAYED_CARD_1_Y,
  },
  2: {
    x: POS_PLAYED_CARD_2_X,
    y: POS_PLAYED_CARD_2_Y,
  },
  3: {
    x: POS_PLAYED_CARD_3_X,
    y: POS_PLAYED_CARD_3_Y,
  },
  4: {
    x: POS_PLAYED_CARD_4_X,
    y: POS_PLAYED_CARD_4_Y,
  },
  5: {
    x: POS_PLAYED_CARD_5_X,
    y: POS_PLAYED_CARD_5_Y,
  },
};

export const generateRandomInteger = (max) => {
  return Math.floor(Math.random() * max) + 1;
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomReal = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};
