import { OVERLIGHT_VIRTUES } from "../virtue";
import {
  OVERLIGHT_DIE_TYPES,
  OVERLIGHT_POOL_MODIFIERS,
  OverlightCombatTest,
  OverlightDieType,
  OverlightHand,
  OverlightModifier,
  OverlightChromaTest,
  OverlightPoolName,
} from "../roll";
import { OverlightChromaTestChat } from "../chats/roll-chroma-test";
import { OVERLIGHT_SKILLS } from "../skill";
import { RollChromaTestDialog } from "./roll-chroma-test";
import { OverlightWealthTestChat } from "../chats/roll-wealth-test";

export class RollWealthTestDialog {
  private static html = "systems/overlight-vtt/templates/dialogs/roll-skill-test.html" as const;

  private static getTemplate(): Promise<HTMLElement> {
    return renderTemplate(RollWealthTestDialog.html, {
      virtues: ["wealth"],
      skills: OVERLIGHT_SKILLS,
      die: OVERLIGHT_DIE_TYPES,
      modifiers: OVERLIGHT_POOL_MODIFIERS,
      defaults: {
        "virtue-die": "d6",
        "skill-die": "d6",
      },
    });
  }

  private dialog: Promise<Dialog>;

  constructor() {
    this.dialog = RollWealthTestDialog.getTemplate().then((content) => {
      return new Dialog(
        {
          title: game.i18n.localize("overlight-vtt.dialog.roll-wealth-test.title"),
          content: content,
          buttons: {
            close: {
              icon: '<i class="fas fa-times"></i>',
              label: game.i18n.localize("overlight-vtt.dialog.roll-skill-test.close"),
            },
            roll: {
              icon: '<i class="fas fa-check"></i>',
              label: game.i18n.localize("overlight-vtt.dialog.roll-skill-test.roll"),
              callback: (result) => {
                const formData = new FormData(result[0].querySelector("#dice-pool-form"));
                return this.handleResponse(formData);
              },
            },
          },
          default: "roll",
        },
        {}
      );
    });
  }

  render(): Promise<Dialog> {
    return this.dialog.then((d) => d.render(true));
  }

  handleResponse(formData: FormData) {
    // Create a new test
    const test = new OverlightChromaTest(
      new OverlightHand(
        "wealth",
        "virtue",
        formData.get("virtue") as OverlightPoolName,
        formData.get("virtue-die") as OverlightDieType,
        formData.get("virtue-mod") as OverlightModifier,
        "skill",
        formData.get("skill") as OverlightPoolName,
        formData.get("skill-die") as OverlightDieType,
        formData.get("skill-mod") as OverlightModifier,
        formData.get("include-spirit") === "on"
      )
    );

    // Roll the test
    test.hand.roll();

    // Send it to chat
    new OverlightWealthTestChat(test).send();
  }
}
