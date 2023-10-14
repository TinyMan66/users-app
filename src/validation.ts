export const validateInputs = (newValue: string, name: string) => {
    let errorMessage = null;

    if (name === "name") {
        if (!/^[A-Za-z]*$/.test(newValue)) {
            errorMessage = "Only alphabetical letters are allowed!";
        }
    } else if (name === "age") {
        if (!/^\d*$/.test(newValue)) {
            errorMessage = "Only numeric characters are allowed!";
        } else if(parseInt(newValue) > 100) {
            errorMessage = "The age must be in the range 1-100!";
        }
    }
    return errorMessage;
}