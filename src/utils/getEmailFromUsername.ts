const getEmailFromUsername = (username: string) => {
  return username.trim().toLowerCase() + '@nilgpt-user.xyz';
};

export default getEmailFromUsername;
