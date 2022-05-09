export function getFieldId(name, formName) {
    if (name.length) {
        const id = name.join("_");
        if (formName) {
            return `${formName}_${id}`;
        } else {
            return id;
        }
    } else {
        return undefined;
    }
}
