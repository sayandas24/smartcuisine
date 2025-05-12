import { body, param, query, validationResult } from "express-validator";

const sanitizeInput = [
  body("*")
    .trim()
    .customSanitizer((value, { req, path }) => {
      return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }),

  param("*").trim().escape(),
  query("*").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

export default sanitizeInput;
