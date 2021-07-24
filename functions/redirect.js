exports.handler = async (event) => {
  const path = encodeURIComponent(event.path);

  return {
    statusCode: 302,
    headers: {
      Location: `/login/?redirect=${path}`,
    },
  };
};
