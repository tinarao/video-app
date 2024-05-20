export const textToSlug = (str: string): string => {
    const restricted = [":", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "[", "]"]
    const syms = str.toLowerCase().split("")
    for (let i = 0; i <= syms.length; i++) {
        if (syms[i] === " ") syms[i] = "_"
        else if (restricted.includes(syms[i])) syms[i] = ""
    }

    return syms.join('')
}