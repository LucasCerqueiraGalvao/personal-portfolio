import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const defaultPackagePath =
    "C:/Program Files (x86)/Steam/steamapps/workshop/content/431960/3509243656/scene.pkg";
const scenePackagePath =
    process.env.WALLPAPER_ENGINE_SCENE_PKG || defaultPackagePath;
const outputDir = path.join(projectRoot, "public", "images", "wallpaper");
const outputImage = path.join(outputDir, "milky-way-8k.jpg");
const manifestPath = path.join(outputDir, "asset-manifest.json");

const PNG_SIGNATURE = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

function readUInt32LE(buffer, offset, label) {
    if (offset + 4 > buffer.length) {
        throw new Error(`Unexpected end of package while reading ${label}.`);
    }

    return buffer.readUInt32LE(offset);
}

function parsePackage(buffer) {
    const magicOffset = buffer.indexOf(Buffer.from("PKGV0023"));

    if (magicOffset === -1) {
        throw new Error("Unsupported Wallpaper Engine package: PKGV0023 header not found.");
    }

    const entriesCount = readUInt32LE(buffer, magicOffset + 8, "entry count");
    let cursor = magicOffset + 12;
    const entries = [];

    for (let i = 0; i < entriesCount; i += 1) {
        const nameLength = readUInt32LE(buffer, cursor, `entry ${i} name length`);
        cursor += 4;

        const rawName = buffer.subarray(cursor, cursor + nameLength);
        cursor += nameLength;

        const dataOffset = readUInt32LE(buffer, cursor, `entry ${i} offset`);
        cursor += 4;

        const size = readUInt32LE(buffer, cursor, `entry ${i} size`);
        cursor += 4;

        entries.push({
            name: rawName.toString("utf8").replace(/\0+$/g, ""),
            dataOffset,
            size,
        });
    }

    return {
        dataStart: cursor,
        entries,
    };
}

function extractEntry(buffer, packageInfo, entryName) {
    const entry = packageInfo.entries.find((item) => item.name === entryName);

    if (!entry) {
        throw new Error(`Entry not found in scene.pkg: ${entryName}`);
    }

    const start = packageInfo.dataStart + entry.dataOffset;
    const end = start + entry.size;

    if (end > buffer.length) {
        throw new Error(`Entry ${entryName} points outside scene.pkg.`);
    }

    return buffer.subarray(start, end);
}

function findEmbeddedPng(buffer) {
    const start = buffer.indexOf(PNG_SIGNATURE);

    if (start === -1) {
        throw new Error("No embedded PNG signature found in materials/st2.tex.");
    }

    let cursor = start + PNG_SIGNATURE.length;

    while (cursor + 12 <= buffer.length) {
        const chunkLength = buffer.readUInt32BE(cursor);
        const chunkType = buffer.subarray(cursor + 4, cursor + 8).toString("ascii");
        cursor += 8 + chunkLength + 4;

        if (chunkType === "IEND") {
            return buffer.subarray(start, cursor);
        }
    }

    throw new Error("Embedded PNG is incomplete or malformed.");
}

function readPngDimensions(pngBuffer) {
    const ihdrOffset = PNG_SIGNATURE.length;
    const type = pngBuffer.subarray(ihdrOffset + 4, ihdrOffset + 8).toString("ascii");

    if (type !== "IHDR") {
        throw new Error("Embedded PNG is missing IHDR.");
    }

    return {
        width: pngBuffer.readUInt32BE(ihdrOffset + 8),
        height: pngBuffer.readUInt32BE(ihdrOffset + 12),
    };
}

function convertPngToJpg(inputPath, outputPath) {
    const psScript = `
param([string]$InputPath, [string]$OutputPath)
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$image = [System.Drawing.Image]::FromFile($InputPath)
try {
    $maxWidth = 8192
    $maxHeight = 4096
    $scale = [Math]::Min($maxWidth / [double]$image.Width, $maxHeight / [double]$image.Height)
    $scale = [Math]::Min($scale, 1)
    $width = [Math]::Max(1, [int][Math]::Round($image.Width * $scale))
    $height = [Math]::Max(1, [int][Math]::Round($image.Height * $scale))

    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    try {
        $bitmap.SetResolution($image.HorizontalResolution, $image.VerticalResolution)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.DrawImage($image, 0, 0, $width, $height)
        }
        finally {
            $graphics.Dispose()
        }

        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
            Where-Object { $_.MimeType -eq "image/jpeg" } |
            Select-Object -First 1
        $quality = New-Object System.Drawing.Imaging.EncoderParameter(
            [System.Drawing.Imaging.Encoder]::Quality,
            88L
        )
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = $quality

        $bitmap.Save($OutputPath, $codec, $encoderParams)
    }
    finally {
        $bitmap.Dispose()
    }
}
finally {
    $image.Dispose()
}
`;
    const scriptPath = path.join(tmpdir(), `convert-wallpaper-${process.pid}.ps1`);

    writeFileSync(scriptPath, psScript);

    const result = spawnSync(
        "powershell",
        [
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            scriptPath,
            inputPath,
            outputPath,
        ],
        {
            stdio: "inherit",
            windowsHide: true,
        }
    );

    rmSync(scriptPath, { force: true });

    if (result.status !== 0) {
        throw new Error("PowerShell/System.Drawing failed to convert the galaxy texture.");
    }
}

if (!existsSync(scenePackagePath)) {
    throw new Error(
        `scene.pkg not found at ${scenePackagePath}. Set WALLPAPER_ENGINE_SCENE_PKG to override.`
    );
}

mkdirSync(outputDir, { recursive: true });

const packageBuffer = readFileSync(scenePackagePath);
const packageInfo = parsePackage(packageBuffer);
const st2Texture = extractEntry(packageBuffer, packageInfo, "materials/st2.tex");
const pngBuffer = findEmbeddedPng(st2Texture);
const dimensions = readPngDimensions(pngBuffer);
const tempPng = path.join(tmpdir(), `wallpaper-st2-${process.pid}.png`);

writeFileSync(tempPng, pngBuffer);
convertPngToJpg(tempPng, outputImage);
rmSync(tempPng, { force: true });

writeFileSync(
    manifestPath,
    `${JSON.stringify(
        {
            assets: [
                {
                    file: "milky-way-8k.jpg",
                    sourceEntry: "materials/st2.tex",
                    sourceTexture: "embedded PNG",
                    sourceDimensions: dimensions,
                    maxDimensions: {
                        width: 8192,
                        height: 4096,
                    },
                },
            ],
        },
        null,
        2
    )}\n`
);

console.log(`Extracted ${dimensions.width}x${dimensions.height} st2 texture.`);
console.log(`Wrote ${path.relative(projectRoot, outputImage)}`);
