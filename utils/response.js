import { v4 as uuidv4 } from "uuid";

export const sendSuccess = (
  res,
  {
    code = "OK",
    message = "OK",
    result = null,
    data = null,
    resourceId = null,
    statusCode = 200,
  }
) => {
  const response = {
    code,
    data,
    message,
    requestId: uuidv4(),
    resourceId: resourceId || uuidv4(),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res,
  {
    code = "ERROR",
    message = "Something went wrong",
    statusCode = 500,
    resourceId = null,
  }
) => {
  return res.status(statusCode).json({
    code,
    message,
    requestId: uuidv4(),
    resourceId: resourceId || uuidv4(),
  });
};
