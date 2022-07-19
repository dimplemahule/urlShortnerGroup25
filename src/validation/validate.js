

const isValidField = (value) => {
    if (typeof value == "undefined" || typeof value == null) return false;
    if (typeof value == "string" && value.trim().length == 0) return false;
    return true;
  };

  const isValidUrl = (value) => {
    return (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value))
  }
  
  module.exports = {isValidField, isValidUrl}

  