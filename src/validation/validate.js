

const isValidField = (value) => {
    if (typeof value == "undefined" || typeof value == null) return false;
    if (typeof value == "string" && value.trim().length == 0) return false;
    return true;
  };

  module.exports = {isValidField}
  