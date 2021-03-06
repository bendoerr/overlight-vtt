import { OverlightSkillType } from "./skill";
import { OverlightVirtueType } from "./virtue";

export function virtueToSkills(virtue: OverlightVirtueType): OverlightSkillType[] {
  switch (virtue) {
    case "wisdom":
      return ["folklore", "intuition", "perception"];
    case "logic":
      return ["windlore", "machinery", "science"];
    case "compassion":
      return ["beastways", "inspiration", "performance"];
    case "will":
      return ["craft", "persuasion", "resolve"];
    case "vigor":
      return ["athletics", "blades", "survival"];
    case "might":
      return ["brawl", "resistance"];
    default:
      return [];
  }
}

export function toColor(virtue: OverlightVirtueType | OverlightSkillType | "spirit"): string {
  switch (virtue) {
    case "wisdom":
    case "folklore":
    case "intuition":
    case "perception":
      return "violet";
    case "logic":
    case "windlore":
    case "machinery":
    case "science":
      return "blue";
    case "compassion":
    case "beastways":
    case "inspiration":
    case "performance":
      return "green";
    case "will":
    case "craft":
    case "persuasion":
    case "resolve":
      return "yellow";
    case "vigor":
    case "athletics":
    case "blades":
    case "survival":
      return "orange";
    case "might":
    case "brawl":
    case "resistance":
      return "red";
    case "spirit":
      return "white";
  }
}

export function toDice3dColor(virtue: OverlightVirtueType | OverlightSkillType | "spirit"): string {
  switch (virtue) {
    case "wisdom":
    case "folklore":
    case "intuition":
    case "perception":
      return "force";
    case "logic":
    case "windlore":
    case "machinery":
    case "science":
      return "ice";
    case "compassion":
    case "beastways":
    case "inspiration":
    case "performance":
      return "acid";
    case "will":
    case "craft":
    case "persuasion":
    case "resolve":
      return "lightning";
    case "vigor":
    case "athletics":
    case "blades":
    case "survival":
      return "bronze";
    case "might":
    case "brawl":
    case "resistance":
      return "bloodmoon";
    case "spirit":
      return "thunder";
  }
}
