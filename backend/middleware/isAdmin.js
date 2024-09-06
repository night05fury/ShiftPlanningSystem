
 const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }};
module.exports = isAdmin;