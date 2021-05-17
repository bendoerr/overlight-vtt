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
import { OverlightCharacterSheet } from "./module/actors/character-sheet";
import { registerAllHelpers } from "./module/handlebars";
import { RollCombatTestDialog } from "./module/dialogs/roll-combat-test";

Hooks.once("init", async function () {
  console.log("Overlight | Initializing Overlight");

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
      RollCombatTestDialog,
    },
  };

  CONFIG.Actor.entityClass = OverlightCharacterActor as typeof Actor;

  game.i18n.localize("overlight-vtt.title");

  // Remove stock sheets
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("overlight-vtt", OverlightCharacterSheet);

  // Items.unregisterSheet("core", ItemSheet);

  // Register Handlebar Helpers
  registerAllHelpers();

  console.log("Overlight | Initializing Overlight Done");
});

/* ------------------------------------ */
/* Setup system							*/
/* ------------------------------------ */
Hooks.once("setup", function () {
  // Do anything after initialization but before ready
  console.log("Overlight | Setting Up Overlight");
  console.log("Overlight | Setting Up Overlight Done");
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once("ready", function () {
  // Do anything once the system is ready
  console.log("Overlight | Preparing Overlight");

  // Attach the standard roll dialog to the d20 on chat
  $(document).on("click", "#chat-controls .chat-control-icon .fa-dice-d20", () => {
    const a = new game.overlight.dialogs.RollSkillTestDialog();
    a.render();
  });

  console.log("Overlight | Preparing Overlight Done");
});
