// This file provides two simple helper functions so that every API
// in this project returns responses in the SAME format.
// Success format: { success: true, message: "...", data: {} }
// Error format:   { success: false, message: "..." }

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {string} message - A short success message
 * @param {any} data - The data to send back (object, array, etc.)
 * @param {number} statusCode - HTTP status code (default 200)
 */
const sendSuccess = (res, message = "Success", data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {string} message - A short error message
 * @param {number} statusCode - HTTP status code (default 500)
 */
const sendError = (res, message = "Something went wrong", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { sendSuccess, sendError };
