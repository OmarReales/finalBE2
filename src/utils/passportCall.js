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

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send({ status: "error", error: "Unauthorized" });
    if (req.user.role !== role)
      return res.status(403).send({ status: "error", error: "Forbidden" });
    next();
  };
};
