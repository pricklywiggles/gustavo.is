// Licensed faces live in the repo only as fonts.tar.enc (AES-256, key in FONTS_KEY);
// committing the WOFF2s in the clear is the redistribution both foundry EULAs forbid.
// Runs before dev and build; a no-op once the files are on disk. `--pack` rebuilds
// the archive after a font change.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FONTS_DIR = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../src/fonts",
);
const ARCHIVE = "fonts.tar.enc";
const FACES = [
	"Kitora-Bold",
	"wotfard-bold",
	"wotfard-extralight",
	"wotfard-light",
	"wotfard-medium",
	"wotfard-regular",
	"wotfard-semibold",
	"wotfard-thin",
].map((name) => `${name}.woff2`);
const CIPHER = ["-aes-256-cbc", "-pbkdf2", "-pass", "env:FONTS_KEY"];

const missing = () => FACES.filter((f) => !existsSync(path.join(FONTS_DIR, f)));

function requireKey() {
	if (process.env.FONTS_KEY) return;
	console.error(
		"FONTS_KEY is unset. It decrypts src/fonts/fonts.tar.enc into the licensed WOFF2 faces;",
		"set it in .env.local (local), the Vercel project (deploys), or the FONTS_KEY Actions secret (CI).",
	);
	process.exit(1);
}

function pack() {
	const absent = missing();
	if (absent.length) {
		console.error(`Cannot pack, missing: ${absent.join(", ")}`);
		process.exit(1);
	}
	requireKey();
	// COPYFILE_DISABLE keeps macOS tar from adding ._ resource-fork entries.
	const tar = execFileSync("tar", ["-cf", "-", ...FACES], {
		cwd: FONTS_DIR,
		env: { ...process.env, COPYFILE_DISABLE: "1" },
	});
	execFileSync("openssl", ["enc", "-e", ...CIPHER, "-salt", "-out", ARCHIVE], {
		cwd: FONTS_DIR,
		input: tar,
		env: process.env,
	});
	console.log(`Packed ${FACES.length} faces into src/fonts/${ARCHIVE}`);
}

function unpack() {
	if (missing().length === 0) return;
	requireKey();
	if (!existsSync(path.join(FONTS_DIR, ARCHIVE))) {
		console.error(`src/fonts/${ARCHIVE} is missing; nothing to decrypt.`);
		process.exit(1);
	}
	let tar;
	try {
		tar = execFileSync("openssl", ["enc", "-d", ...CIPHER, "-in", ARCHIVE], {
			cwd: FONTS_DIR,
			env: process.env,
			stdio: ["ignore", "pipe", "pipe"],
		});
	} catch (error) {
		console.error(
			"Decrypting src/fonts/fonts.tar.enc failed; is FONTS_KEY the right key?",
		);
		console.error(String(error.stderr ?? error.message).trim());
		process.exit(1);
	}
	execFileSync("tar", ["-xf", "-"], { cwd: FONTS_DIR, input: tar });
	const absent = missing();
	if (absent.length) {
		console.error(`Archive did not contain: ${absent.join(", ")}`);
		process.exit(1);
	}
	console.log(`Unpacked ${FACES.length} licensed faces into src/fonts/`);
}

if (process.argv.includes("--pack")) pack();
else unpack();
