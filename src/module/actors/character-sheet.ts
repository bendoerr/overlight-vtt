import { OverlightCharacterActor, OverlightCharacterData } from "./character";

export class OverlightCharacterSheet extends ActorSheet<OverlightCharacterData, OverlightCharacterActor> {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 750,
      height: 950,
    });
  }
  /** @override */
  get template(): string {
    return "systems/overlight-vtt/templates/actors/character-sheet.html";
  }
  /** @override */
  protected activateListeners(html: JQuery) {
    super.activateListeners(html);

    // Attach click to open skill roll
    $(html)
      .find(".o-cs-do-skill-roll")
      .on("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const a = new game.overlight.dialogs.RollSkillTestDialog();
        a.render();
      });

    $(html)
      .find(".o-cs-do-combat-roll")
      .on("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const a = new game.overlight.dialogs.RollSkillTestDialog();
        a.render();
      });

    $(html)
      .find(".o-cs-do-open-roll")
      .on("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const a = new game.overlight.dialogs.RollSkillTestDialog();
        a.render();
      });

    $(html)
      .find(".o-cs-do-wealth-roll")
      .on("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const a = new game.overlight.dialogs.RollSkillTestDialog();
        a.render();
      });

    $(html)
      .find(".o-cs-do-chroma-roll")
      .on("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const a = new game.overlight.dialogs.RollSkillTestDialog();
        a.render();
      });
  }
  /** @override */
  getData(): ActorSheetData<OverlightCharacterData> {
    const data = super.getData();
    const cData = (data.data as unknown) as OverlightCharacterData;
    for (let i = 1; i <= 20; i++) {
      if (!("boxes" in cData.health)) {
        cData.health["boxes"] = {};
      }
      if (!("b" + i in cData.health["boxes"])) {
        cData.health["boxes"]["b" + i] = {
          disabled: false,
          checked: false,
        };
      }
      if (i > cData.health.max) {
        cData.health["boxes"]["b" + i]["disabled"] = true;
        cData.health["boxes"]["b" + i]["checked"] = false;
      } else {
        cData.health["boxes"]["b" + i]["disabled"] = false;
      }
    }
    return data;
  }
}
