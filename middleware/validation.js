module.exports = function(req, res, next) {
    const { user_email, user_name, user_password } = req.body;
  
    function validEmail(user_email) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email);
    }
  
    if (req.path === "/registration") {
      console.log(!user_email.length);
      if (![user_email, user_name, user_password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validEmail(user_email)) {
        return res.json("Invalid Email");
      }
    } else if (req.path === "/login") {
      if (![user_email, user_password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validEmail(user_email)) {
        return res.json("Invalid Email");
      }
    }
  
    next();
};