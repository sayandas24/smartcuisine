export const generatePassword = () => { 
    const password = Math.random().toString(36).substring(2, 15);
    return password; 
}