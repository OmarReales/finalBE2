export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  // Validación básica de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email format",
    });
  }

  next();
};

export const validateRegister = (req, res, next) => {
  const { first_name, last_name, email, password, age } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
  }

  // Validación básica de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email format",
    });
  }

  // Validación de edad
  if (age && (isNaN(age) || age < 0)) {
    return res.status(400).json({
      status: "error",
      message: "Age must be a positive number",
    });
  }

  // Validación de contraseña (mínimo 8 caracteres)
  if (password.length < 8) {
    return res.status(400).json({
      status: "error",
      message: "Password must be at least 8 characters long",
    });
  }

  next();
};
