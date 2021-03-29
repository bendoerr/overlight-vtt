import { OverlightSkillType } from "./skill";
import { OverlightVirtueType } from "./virtue";
import { toColor, toDice3dColor } from "./utils";

export declare type OverlightTestType = "skill" | "combat" | "open" | "chroma";
export declare type OverlightPoolType = "virtue" | "skill" | "wealth" | "spirit" | "empty" | OverlightTestType;
export declare type OverlightPoolName = OverlightVirtueType | OverlightSkillType | OverlightTestType;
export declare type OverlightDieType = "untrained" | "d4" | "d6" | "d8" | "d10" | "d12" | "none";
export declare type OverlightFace = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 0;
export declare type OverlightHandType = "skill" | "combat" | "open" | "chroma" | "wealth";
export declare type OverlightModifier = "raise" | "lower" | "none" | "d6" | "d8" | "d10" | "d12";
export declare type OverlightGameResult = "fail" | "luminous" | "radiant" | "brilliant" | "legendary";
export declare type OverlightSpiritResult = "none" | "flare" | "pool" | "legendary" | "fury";

export const OVERLIGHT_DIE_TYPES = ["untrained", "d4", "d6", "d8", "d10", "d12"] as const;
export const OVERLIGHT_VIRTUE_DIE_TYPES = ["d6", "d8", "d10", "d12"] as const;
export const OVERLIGHT_POOL_MODIFIERS = ["none", "raise", "lower", "d6", "d8", "d10", "d12"];

export interface OverlightDie {
  face: OverlightFace;
  name: OverlightPoolName;
  pool: OverlightPoolType;
  success: boolean;
  type: OverlightDieType;
}

export interface OverlightRollable {
  type: OverlightPoolType | OverlightHandType;
  name: OverlightPoolName;
  roll(): OverlightRollable;
  successes(): number;
  results(): OverlightDie[];
  highestResult(): OverlightDie;
  toFoundry(): Roll[];
}

export class OverlightPool implements OverlightRollable {
  readonly type: OverlightPoolType;
  readonly name: OverlightPoolName;
  readonly die: OverlightDieType;
  readonly modifier: OverlightModifier;
  readonly modifierSpill: boolean;
  readonly foundryRoll: Roll;

  private rolled: boolean;

  constructor(type: OverlightPoolType, name: OverlightPoolName, die: OverlightDieType, modifier: OverlightModifier) {
    this.type = type;
    this.name = name;
    this.die = die;
    this.modifier = modifier;
    this.modifierSpill = false;
    if (type === "spirit") {
      if (modifier !== "none") {
        throw new Error("cannot modify spirit dice pool");
      }
      this.foundryRoll = new Roll("d4cs4");
    } else {
      if (modifier === "none") {
        if (die === "untrained") {
          this.foundryRoll = new Roll("d6cs>=6");
        } else {
          this.foundryRoll = new Roll("3" + die + "cs>=6");
        }
      } else {
        const [modDie, spill, modNum] = modifyDieType(die, modifier);
        this.modifierSpill = spill;
        if (die === "untrained") {
          const numDie = 1 + modNum;
          this.foundryRoll = new Roll(numDie + modDie + "cs>=6");
        } else {
          const numDie = 3 + modNum;
          if (die === modDie) {
            this.foundryRoll = new Roll(numDie + die + "cs>=6");
          } else {
            this.foundryRoll = new Roll("{" + modDie + "cs>=6" + ",2" + die + "cs>=6");
          }
        }
      }
    }
  }
  roll(): OverlightPool {
    if (this.rolled) {
      return this;
    }
    this.foundryRoll.roll();
    this.foundryRoll.dice.forEach((d) => {
      d.options["colorset"] = toDice3dColor(this.name as OverlightVirtueType | OverlightSkillType);
    });
    this.rolled = true;
    return this;
  }
  successes(): number {
    if (this.rolled == false) throw new Error("pool has not been rolled");
    return this.foundryRoll.dice.reduce((successes, term) => successes + term.total, 0);
  }
  results(): OverlightDie[] {
    if (this.rolled == false) throw new Error("pool has not been rolled");
    return this.foundryRoll.dice.flatMap((d) => {
      return d.results.map((o) => {
        return {
          face: o["result"],
          type: this.die !== "untrained" ? (("d" + d.faces) as OverlightDieType) : this.die,
          name: this.name,
          pool: this.type,
          success: o["success"],
        };
      });
    });
  }
  highestResult(): OverlightDie {
    return this.results().reduce((highest, current) => {
      return current.face > highest.face ? current : highest;
    });
  }
  toFoundry(): Roll[] {
    return [this.foundryRoll];
  }
}

export class OverlightEmptyPool implements OverlightRollable {
  readonly type: OverlightPoolType;
  readonly name: OverlightPoolName;

  constructor(type: OverlightPoolType, name: OverlightPoolName) {
    this.type = type;
    this.name = name;
  }

  highestResult(): OverlightDie {
    return {
      face: 0,
      name: this.name,
      pool: this.type,
      success: false,
      type: "none",
    };
  }

  results(): OverlightDie[] {
    return [];
  }

  roll(): OverlightRollable {
    return this;
  }

  successes(): number {
    return 0;
  }
  toFoundry(): Roll[] {
    return [];
  }
}

export class OverlightHand implements OverlightRollable {
  readonly type: OverlightHandType;
  readonly name: OverlightPoolName;
  readonly poolOne: OverlightRollable;
  readonly poolTwo: OverlightRollable;
  readonly poolSpirit: OverlightRollable;

  constructor(
    type: OverlightHandType,
    poolOneType: OverlightPoolType,
    poolOneName: OverlightPoolName,
    poolOneDie: OverlightDieType,
    poolOneMod: OverlightModifier,
    poolTwoType: OverlightPoolType,
    poolTwoName: OverlightPoolName,
    poolTwoDie: OverlightDieType,
    poolTwoMod: OverlightModifier,
    includeSpirit: boolean
  ) {
    this.type = type;
    this.poolOne = new OverlightPool(poolOneType, poolOneName, poolOneDie, poolOneMod);
    this.poolTwo = new OverlightPool(poolTwoType, poolTwoName, poolTwoDie, poolTwoMod);
    if (includeSpirit) {
      this.poolSpirit = new OverlightPool("spirit", "spirit", "d4", "none");
    } else {
      this.poolSpirit = new OverlightEmptyPool("spirit", "spirit");
    }
  }

  roll(): OverlightHand {
    this.poolOne.roll();
    this.poolTwo.roll();
    this.poolSpirit.roll();
    return this;
  }

  results(): OverlightDie[] {
    return this.poolOne.results().concat(this.poolTwo.results(), this.poolSpirit.results());
  }

  highestResult(): OverlightDie {
    const r1 = this.poolOne.highestResult();
    const r2 = this.poolTwo.highestResult();
    return r1 < r2 ? r1 : r2;
  }

  successes(): number {
    return this.poolOne.successes() + this.poolTwo.successes();
  }

  toFoundry(): Roll[] {
    return this.poolOne.toFoundry().concat(this.poolTwo.toFoundry(), this.poolSpirit.toFoundry());
  }
}

/// See page 118
export function modifyDieType(
  type: OverlightDieType,
  modifier: OverlightModifier
): [OverlightDieType, boolean, number] {
  if (modifier === "none" || type === "d4") {
    return [type, false, 0];
  }
  if (modifier !== "raise" && modifier !== "lower") {
    return [modifier, false, 0];
  }
  switch (type) {
    case "untrained":
      return modifier === "raise" ? ["d4", false, 1] : ["d4", false, 0];
    case "d6":
      return modifier === "raise" ? ["d8", false, 0] : ["d6", false, -1];
    case "d8":
      return modifier === "raise" ? ["d10", false, 0] : ["d6", false, 0];
    case "d10":
      return modifier === "raise" ? ["d12", false, 0] : ["d8", false, 0];
    case "d12":
      return modifier === "raise" ? ["d12", true, 0] : ["d10", false, 0];
  }
}

export declare interface OverlightTest<T> {
  hand: OverlightHand;
  result(): T;
}

export declare interface OverlightSkillTestResult {
  successes: number;
  successesRaw: number;
  gameResult: OverlightGameResult;
  gameResultRaw: OverlightGameResult;
  spiritResult: OverlightSpiritResult;
  hand: OverlightHand;
  poolOneName: OverlightPoolName;
  poolOneType: OverlightPoolType;
  poolOneFormula: string;
  poolOneSuccesses: number;
  poolOneResults: OverlightDie[];
  poolTwoName: OverlightPoolName;
  poolTwoType: OverlightPoolType;
  poolTwoFormula: string;
  poolTwoSuccesses: number;
  poolTwoResults: OverlightDie[];
  poolSpiritName: OverlightPoolName;
  poolSpiritType: OverlightPoolType;
  poolSpiritFormula: string;
  poolSpiritSuccesses: number;
  poolSpiritResults: OverlightDie[];
}

export class OverlightSkillTest implements OverlightTest<OverlightSkillTestResult> {
  hand: OverlightHand;

  constructor(hand: OverlightHand) {
    this.hand = hand;
  }

  result(): OverlightSkillTestResult {
    this.hand.roll();

    const result = {
      successes: this.hand.successes(),
      successesRaw: this.hand.successes(),
      gameResult: "fail" as OverlightGameResult,
      gameResultRaw: "fail" as OverlightGameResult,
      spiritResult: "none" as OverlightSpiritResult,
      hand: this.hand,
      poolOneType: this.hand.poolOne.type,
      poolOneName: this.hand.poolOne.name,
      poolOneFormula: this.hand.poolOne.toFoundry()[0].formula,
      poolOneSuccesses: this.hand.poolOne.successes(),
      poolOneResults: this.hand.poolOne.results(),
      poolTwoType: this.hand.poolTwo.type,
      poolTwoName: this.hand.poolTwo.name,
      poolTwoFormula: this.hand.poolTwo.toFoundry()[0].formula,
      poolTwoSuccesses: this.hand.poolTwo.successes(),
      poolTwoResults: this.hand.poolTwo.results(),
      poolSpiritName: this.hand.poolSpirit.name,
      poolSpiritType: this.hand.poolSpirit.type,
      poolSpiritFormula: this.hand.poolSpirit.toFoundry().length > 0 ? this.hand.poolSpirit.toFoundry()[0].formula : "",
      poolSpiritSuccesses: this.hand.poolSpirit.successes(),
      poolSpiritResults: this.hand.poolSpirit.results(),
    };

    if (result.successes >= 6) {
      result.gameResultRaw = "brilliant";
    } else if (result.successes >= 4) {
      result.gameResultRaw = "radiant";
    } else if (result.successes >= 2) {
      result.gameResultRaw = "luminous";
    }

    if (result.successes > 0 && this.hand.poolSpirit.successes() > 0) {
      if (result.successes === 6) {
        result.spiritResult = "legendary";
      } else if (result.successes % 2 === 0) {
        result.spiritResult = "pool";
      } else {
        result.spiritResult = "flare";
        result.successes += 1;
      }
    }

    if (result.successes >= 6) {
      if (result.spiritResult === "legendary") {
        result.gameResult = "legendary";
      } else {
        result.gameResult = "brilliant";
      }
    } else if (result.successes >= 4) {
      result.gameResult = "radiant";
    } else if (result.successes >= 2) {
      result.gameResult = "luminous";
    }

    return result;
  }
}

export declare interface OverlightCombatTestResult {
  damage: number;
  fury: boolean;
  hand: OverlightHand;
}

export class OverlightCombatTest implements OverlightTest<OverlightCombatTestResult> {
  hand: OverlightHand;

  constructor(hand: OverlightHand) {
    this.hand = hand;
  }

  result(): OverlightCombatTestResult {
    this.hand.roll();

    return {
      damage: this.hand.successes(),
      fury: this.hand.poolSpirit.successes() > 0,
      hand: this.hand,
    };
  }
}

export declare interface OverlightOpenTestResult {
  highest: number;
  highestRaw: number;
  bonus: boolean;
  hand: OverlightHand;
}

export class OverlightOpenTest implements OverlightTest<OverlightOpenTestResult> {
  hand: OverlightHand;

  constructor(hand: OverlightHand) {
    this.hand = hand;
  }

  result(): OverlightOpenTestResult {
    const result = {
      highest: this.hand.highestResult().face,
      highestRaw: this.hand.highestResult().face,
      bonus: this.hand.poolSpirit.successes() > 0,
      hand: this.hand,
    };
    if (result.bonus) {
      result.highest += 1;
    }
    return result;
  }
}

export declare interface OverlightChromaTestResult extends OverlightSkillTestResult {
  cost: number;
}

export class OverlightChromaTest implements OverlightTest<OverlightChromaTestResult> {
  hand: OverlightHand;
  skillTest: OverlightSkillTest;

  constructor(hand: OverlightHand) {
    this.hand = hand;
    this.skillTest = new OverlightSkillTest(hand);
  }

  result(): OverlightChromaTestResult {
    const sr = this.skillTest.result() as OverlightChromaTestResult;
    sr.cost = this.skillTest.hand.poolSpirit.results()[0].face;
    return sr;
  }
}
