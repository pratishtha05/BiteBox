exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.auth || req.auth.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    next();
  };
};
