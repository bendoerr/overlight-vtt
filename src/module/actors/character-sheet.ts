import { OverlightCharacterActor, OverlightCharacterData } from "./character";

export class OverlightCharacterSheet extends ActorSheet<OverlightCharacterData, OverlightCharacterActor> {
  get template(): string {
    return "systems/overlight-vtt/templates/actors/character-sheet.html";
  }
}
