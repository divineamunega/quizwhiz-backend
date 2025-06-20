// src/utils/emailTemplates.ts
import fs from "fs";
import path from "path";

// todo sanitization
export const renderVerifyCodeTemplate = (
	code: string,
	name: string
): string => {
	const templatePath = path.join(
		__dirname,
		"../../../emailTemplates/verifyCode.html"
	);
	let template = fs.readFileSync(templatePath, "utf-8");
	template = template.replaceAll("{{CODE}}", code);
	return template.replaceAll("{{NAME}}", name);
};
