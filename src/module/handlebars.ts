import { virtueToSkills } from "./utils";

export function registerAllHelpers(): void {
  // Preload SVGs
  loadOverlightSvgs();

  // Register the helpers
  Handlebars.registerHelper(debug.name, debug);
  Handlebars.registerHelper(stringify.name, stringify);
  Handlebars.registerHelper(concat.name, concat);
  Handlebars.registerHelper(select_it.name, select_it);
  Handlebars.registerHelper(get_svg.name, get_svg);
  Handlebars.registerHelper(get_svg_b64.name, get_svg_b64);

  // Util helpers
  Handlebars.registerHelper("v2s", virtueToSkills);
}

function debug(): string {
  return JSON.stringify(this, null, 2);
}

function stringify(obj: any): string {
  return JSON.stringify(this, null, 2);
}

function concat(a, b, c, d, e, f, o: any): string {
  return [a, b, c, d, e, f].filter((v) => typeof v === "string").join("");
}

function select_it(a: Record<string, unknown>, b: string, opts: Handlebars.HelperOptions): Handlebars.SafeString {
  return Handlebars.helpers["select"](a[b], opts);
}

const SVGS = {
  spirit: "",
  wisdom: "",
  logic: "",
  compassion: "",
  will: "",
  vigor: "",
  might: "",
  "fury-triangle": "",
  "spirit-triangle": "",
};

export function loadOverlightSvgs(): void {
  for (const key in SVGS) {
    game.socket.emit("template", `systems/overlight-vtt/assets/svgs/${key}.html`, (resp) => {
      if (resp.error) return console.error(resp.error);
      SVGS[key] = resp.html;
      console.log("Overlight | Loaded SVG for " + key.capitalize() + " Icon");
    });
  }
}

function get_svg(name: string): Handlebars.SafeString {
  return new Handlebars.SafeString(SVGS[name]);
}

function get_svg_b64(name: string): Handlebars.SafeString {
  return new Handlebars.SafeString(btoa(SVGS[name]));
}
