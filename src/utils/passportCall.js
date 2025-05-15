import passport from "passport";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(401).send({
          status: "error",
          error: info.message ? info.message : info.toString(),
        });
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (roles) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send({ status: "error", error: "Unauthorized" });

    // Convertir un único rol a un array para mantener consistencia
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role))
      return res.status(403).send({
        status: "error",
        error: "Forbidden - Insufficient permissions",
      });

    next();
  };
};
