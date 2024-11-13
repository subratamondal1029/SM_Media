class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.data = null;
    this.success = false;
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
      success: this.success,
    };
  }
}

export default ApiError;
