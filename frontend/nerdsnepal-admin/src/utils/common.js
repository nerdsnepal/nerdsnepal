const emailValidator= (email)=>email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
const validateUserName  = (username)=>username.match( /^[a-zA-Z0-9_]{5,29}$/)


export {emailValidator,validateUserName}