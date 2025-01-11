export default (theFunc) => async (req, res, next) => {
    try {
      await Promise.resolve(theFunc(req, res, next));
    } catch (error) {
      // Log error for debugging
      console.error('AsyncError:', error);
      
      // Pass error to express error handler
      return next(error);
    }
  };