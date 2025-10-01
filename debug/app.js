async function getUserTheme(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }
  const theme = user.profile?.settings?.theme;
  if (!theme) {
    throw new Error(`Theme not set for user ${userId}`);
  }

  return theme;
}


function processUsers(users) {
  let result = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active == true) {
      let userData = {
        id: users[i].id,
        name: users[i].firstName + ' ' + users[i].lastName,
        email: users[i].email.toLowerCase(),
        joinDate: new Date(users[i].createdAt).toISOString().split('T')[0]
      };
      result.push(userData);
    }
  }
  return result;
}

function processUsers(users) {
  return users
    .filter(user => user.active === true)
    .map(({ id, firstName, lastName, email, createdAt }) => ({
      id,
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      joinDate: new Date(createdAt).toISOString().split('T')[0],
    }));
}
