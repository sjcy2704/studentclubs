import { api } from "./api";

function validatePassword(password, confirm) {
  if (password !== confirm) {
    return ["Passwords does not match"];
  }

  let msg = [];

  const oneLower = /[a-z]/.test(password);
  const oneUpper = /[A-Z]/.test(password);
  const oneNumber = /[\d]/.test(password);

  if (password.length < 9) {
    msg.push("Password should be at least 8 characters");
  }
  if (!oneLower) {
    msg.push("Password should contain at least a lowercase letter");
  }
  if (!oneUpper) {
    msg.push("Password should contain at least an uppercase letter");
  }
  if (!oneNumber) {
    msg.push("Password should contain at least a number");
  }

  return msg;
}

export async function validateUser(signup, update = false) {
  let errs = [];
  if (/\s/.test(signup.username)) {
    errs.push("Username should not contain spaces");
  } else {
    if (!update) {
      await api.get(`/users/username/${signup.username}`).then((res) => {
        if (res.data.length > 0) {
          errs.push("Username already exists");
        }
      });
    }
  }

  if (signup.password) {
    errs.push(...validatePassword(signup.password, signup.confirm));
  }

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(signup.email)) {
    errs.push("Invalid email address");
  }

  return errs;
}

// Club Register Validators

export function validateClub(details, update) {
  let errs = [];
  if (details.name.length === 0) {
    errs.push("Name cannot be empty");
  }

  if (details.short_name.length === 0) {
    errs.push("Short Name cannot be empty");
  }

  if (details.category.length === 0) {
    errs.push("Select a category");
  }

  if (!details.logo && !update) {
    errs.push("Requires a Club Logo");
  }

  return errs;
}
