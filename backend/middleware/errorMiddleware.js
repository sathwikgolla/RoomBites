export function notFound(req, res, next) {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(error, req, res, next) {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || "field";
    const messages = {
      email: "Email already registered",
      phone: "Phone number already in use",
      studentId: "Student ID already exists",
      deliveryId: "Delivery ID already exists",
      adminId: "Admin ID already exists",
    };
    res.status(409).json({
      success: false,
      message: messages[field] || `${field} already exists`,
      field,
    });
    return;
  }

  const statusCode = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    message: error.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
}
