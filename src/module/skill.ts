export declare type OverlightSkillType =
  | OverlightSkillWisdomType
  | OverlightSkillLogicType
  | OverlightSkillCompassionType
  | OverlightSkillWillType
  | OverlightSkillVigorType
  | OverlightSkillMightType;
export declare type OverlightSkillWisdomType = "folklore" | "intuition" | "perception";
export declare type OverlightSkillLogicType = "windlore" | "machinery" | "science";
export declare type OverlightSkillCompassionType = "beastways" | "inspiration" | "performance";
export declare type OverlightSkillWillType = "craft" | "persuasion" | "resolve";
export declare type OverlightSkillVigorType = "athletics" | "blades" | "survival";
export declare type OverlightSkillMightType = "brawl" | "resistance";

export const OVERLIGHT_SKILLS = [
  "folklore",
  "intuition",
  "perception",
  "windlore",
  "machinery",
  "science",
  "beastways",
  "inspiration",
  "performance",
  "craft",
  "persuasion",
  "resolve",
  "athletics",
  "blades",
  "survival",
  "brawl",
  "resistance",
] as const;
