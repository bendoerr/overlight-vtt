import { OverlightDieType } from "../roll";
import { OverlightVirtueType } from "../virtue";
import { OverlightSkillType } from "../skill";

export declare interface OverlightCharacterData {
  spiritPool: number;
  furyPool: number;
  healthTrack: {
    current: number;
    max: number;
  };
  virtues: { [key in OverlightVirtueType]: OverlightDieType };
  skills: {
    [key in OverlightSkillType]: { untrained: boolean; value: OverlightDieType };
  };
}

export class OverlightCharacterActor extends Actor<OverlightCharacterData> {
  constructor(data: EntityData<any>, options: any) {
    super(data, options);
  }
}
