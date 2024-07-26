import { configDotenv } from "dotenv";
import app from "./app";

configDotenv({ path: "./env" });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} in {development mode}`);
});
