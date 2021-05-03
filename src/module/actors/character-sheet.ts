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
}
