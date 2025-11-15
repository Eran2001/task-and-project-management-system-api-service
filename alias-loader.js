import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function resolve(specifier, context, nextResolve) {
  const aliases = {
    "@routes": "routes",
    "@configs": "configs",
    "@controllers": "controllers",
    "@utils": "utils",
    "@models": "models",
    "@middlewares": "middlewares",
  };

  for (const alias in aliases) {
    if (specifier.startsWith(alias)) {
      const subPath = specifier.replace(alias, "").replace(/^\//, "");

      const realAbsolutePath = path.resolve(__dirname, aliases[alias], subPath);

      return nextResolve(pathToFileURL(realAbsolutePath).href, context);
    }
  }

  return nextResolve(specifier, context);
}
