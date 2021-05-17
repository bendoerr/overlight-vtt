import { OverlightCombatTest, OverlightCombatTestResult, OverlightGameResult } from "../roll";

export class OverlightCombatTestChat {
  private static html = "systems/overlight-vtt/templates/chats/roll-combat-test.html" as const;

  private static getTemplate(data: OverlightCombatTestResult): Promise<HTMLElement> {
    return renderTemplate(OverlightCombatTestChat.html, data);
  }

  private test: OverlightCombatTest;

  constructor(test: OverlightCombatTest) {
    this.test = test;
  }

  async send() {
    return OverlightCombatTestChat.getTemplate(this.test.result()).then(async (content) => {
      if (game.dice3d) {
        await Promise.all(this.test.hand.toFoundry().map((r) => game.dice3d.showForRoll(r, game.user, true)));
      }
      return ChatMessage.create({
        user: game.user._id,
        flavor: this.makeFlavor(),
        content: content,
      });
    });
  }

  resolveTestName(): string {
    return game.i18n.format("overlight-vtt.tests.combat.name", {});
  }

  resolveVirtueName(): string {
    return game.i18n.format("overlight-vtt.virtue." + this.test.hand.poolOne.name + ".name", {});
  }

  resolveSkillName(): string {
    return game.i18n.format("overlight-vtt.skill." + this.test.hand.poolTwo.name + ".name", {});
  }

  resolveSpiritName(): string {
    return game.i18n.format("overlight-vtt.virtue.spirit.name", {});
  }

  makeFlavor(): string {
    let spiritText = "";
    if (this.test.hand.poolSpirit.results().length > 0) {
      spiritText = "(" + this.resolveSpiritName() + ")";
    }
    return (
      this.resolveTestName() + ": " + this.resolveVirtueName() + " + " + this.resolveSkillName() + " " + spiritText
    );
  }
}
