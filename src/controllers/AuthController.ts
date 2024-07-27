import AsyncErrorHandler from "../errors/AsyncErrorHandler";

const signup = AsyncErrorHandler(async (req, res, next) => {});

const login = AsyncErrorHandler(async (req, res, next) => {});

const protect = AsyncErrorHandler(async (req, res, next) => {});

export { signup, login, protect };
