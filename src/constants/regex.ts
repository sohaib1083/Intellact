/*
 * name validation
 * accepted: letters & spaces, minimum 3 chars, maximum 15 chars
 */
export const name: RegExp = /[a-zA-Z\ ]{3,15}/;

/*
 * email validation
 */
export const email: RegExp = /^[^\s@]+@[^\s@]+\.([^\s@]{2,})+$/;

/*
 * phone validation
 * accepted: international format with + or numbers only, minimum 10 digits
 */
export const phone: RegExp = /^[\+]?[1-9][\d]{9,15}$/;

/*
 * password validation, should contain:
 * (?=.*\d): at least one digit
 * (?=.*[a-z]): at least one lower case
 * (?=.*[A-Z]): at least one uppercase case
 * minimum 6 characters, allows special characters
 */
export const password: RegExp =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
