const handleError = (error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || 'Something went wrong!';
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: error.stack,
  });
};

export default handleError;
