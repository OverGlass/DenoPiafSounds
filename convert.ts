import { HandlerFunc, Context } from "https://deno.land/x/abc/mod.ts";
interface sounds {
  piafname: string;
  urls: Array<string>;
}
const convert: HandlerFunc = async (c) => {
  // console.log(c)
  const req = c.request;
  try {
    // console.log(req);
    const sounds: sounds = JSON.parse(JSON.stringify(await c.body()));
    const cwd = Deno.cwd();
    const piafname = sounds.piafname.split(" ").join("_");
    Deno.mkdirSync("./tmp");
    Deno.mkdirSync("./tmp/cripiaf");
    const urls = sounds.urls;
    if (urls.length > 0) {
      const promises = urls.map(async (url, i) => {
        await Deno.run({
          cmd: [
            "curl",
            "-L",
            "-o",
            `${cwd}/tmp/cripiaf/${piafname}-0${i + 1}.mp3`,
            `${url}`,
          ],
        }).status();
      });
      await Promise.all(promises);
      // // ZIP PNGs
      const zipPath = `${cwd}/tmp/${piafname}.zip`;
      console.log("end");
      const zipProcess = Deno.run({
        cmd: ["zip", "-r", zipPath, "-j", `${cwd}/tmp/cripiaf/`],
      });
      await zipProcess.status();
      // Send Zip
      const zipFile = await Deno.open(zipPath);
      c.blob(zipFile, "application/zip", 201);
    }
    Deno.removeSync("./tmp", { recursive: true });
  } catch (e) {
    console.log(e);
    Deno.removeSync("./tmp", { recursive: true });
  }
};

export default convert;
