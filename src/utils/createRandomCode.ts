import bcrypt from "bcryptjs";
import crypto from "node:crypto";

// Function overloads
export async function createRandomCode(
	charLength: number,
	hashCode: true
): Promise<{ rawCode: string; hashedCode: string }>;

export async function createRandomCode(
	charLength: number,
	hashCode?: false
): Promise<{ rawCode: string; hashedCode: null }>;

// Implementation
export async function createRandomCode(
	charLength: number,
	hashCode: boolean = true
): Promise<{ rawCode: string; hashedCode: string | null }> {
	if (charLength % 2 !== 0) {
		throw new Error(
			"charLength must be an even number (hex encoding = 2 chars/byte)"
		);
	}

	const rawCode = crypto.randomBytes(charLength / 2).toString("hex");

	if (!hashCode) return { rawCode, hashedCode: null };

	const hashedCode = await bcrypt.hash(rawCode, 12);
	return { rawCode, hashedCode };
}
