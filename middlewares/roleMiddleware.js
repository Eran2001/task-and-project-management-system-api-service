export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "owner") {
    return res.status(403).json({ error: "Access Denied" });
  }
  next();
};
