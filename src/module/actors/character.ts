import { OverlightDieType } from "../roll";
import { OverlightVirtueType } from "../virtue";
import { OverlightSkillType } from "../skill";

// export interface OverlightChroma {
//   name: string;
//   virtue1: OverlightVirtueType;
//   virtue2: OverlightVirtueType;
//   text1: string;
//   text2: string;
//   text3: string;
// }

export declare interface OverlightCharacterData {
  spiritPool: number;
  furyPool: number;
  healthTrack: {
    current: number;
    max: number;
  };
  virtues: { [key in OverlightVirtueType]: OverlightDieType };
  skills: { [key in OverlightSkillType]: OverlightDieType };
  wealthDie: OverlightDieType;
  wealthPool: number;
  // chroma: [OverlightChroma, OverlightChroma, OverlightChroma, OverlightChroma, OverlightChroma, OverlightChroma];
}

export class OverlightCharacterActor extends Actor<OverlightCharacterData> {
  constructor(data: EntityData<any>, options: any) {
    super(data, options);
  }
}
