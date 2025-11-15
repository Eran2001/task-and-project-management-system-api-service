export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashed,
    role,
  });

  return res.json({ message: "User created", user: newUser });
};
