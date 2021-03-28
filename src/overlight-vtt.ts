/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your system, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your system
 */

// Import TypeScript modules

/* ------------------------------------ */
/* Initialize system					*/
/* ------------------------------------ */
import { OverlightCharacterActor } from "./module/actors/character";
import { OverlightHand, OverlightPool } from "./module/roll";
import { RollSkillTestDialog } from "./module/dialogs/roll-skill-test";

Hooks.once("init", async function () {
  console.log("overlight-vtt | Initializing Overlight");

  // Assign custom classes and constants here
  game.overlight = {
    entities: {
      OverlightCharacterActor,
    },
    rollers: {
      OverlightHand,
      OverlightPool,
    },
    dialogs: {
      RollSkillTestDialog,
    },
  };

  CONFIG.Actor.entityClass = OverlightCharacterActor as typeof Actor;

  game.i18n.localize("overlight-vtt.title");

  // Remove stock sheets
  // Actors.unregisterSheet("core", ActorSheet);
  // Items.unregisterSheet("core", ItemSheet);

  Handlebars.registerHelper("debug", function () {
    return JSON.stringify(this, null, 2);
  });
  Handlebars.registerHelper("stringify", function (obj) {
    return JSON.stringify(obj, null, 2);
  });
  Handlebars.registerHelper("concat", function (a, b, c, d, e, f, o) {
    return [a, b, c, d, e, f].filter((v) => typeof v === "string").join("");
  });
  Handlebars.registerHelper("if_eq", function (a, b, opts) {
    if (a === b)
      return opts.fn(this);
    else return opts.inverse(this);
  });
});

/* ------------------------------------ */
/* Setup system							*/
/* ------------------------------------ */
Hooks.once("setup", function () {
  // Do anything after initialization but before ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once("ready", function () {
  // Do anything once the system is ready
  // Reference a Compendium pack by it's collection ID
});
