import fs from "fs";
import path from "path";

const publicFolderPath = path.join(process.cwd(), "public");
const assetsFolderPath = path.join(publicFolderPath, "assets");

export function readHTML(
  fileName: string,
  handlers: {onSuccess: (data: string) => void; onError: (error: NodeJS.ErrnoException) => void}
): void {
  fs.readFile(
    path.join(publicFolderPath, fileName),
    { encoding: "utf-8" },
    (error, data) => (error ? handlers.onError(error) : handlers.onSuccess(data))
  );
}

export function readAsset(
  fileName: string,
  handlers: {onSuccess: (data: Buffer) => void; onError: (error: NodeJS.ErrnoException) => void}
): void {
  fs.readFile(path.join(assetsFolderPath, fileName), (error, data) => (error ? handlers.onError(error) : handlers.onSuccess(data)));
}
