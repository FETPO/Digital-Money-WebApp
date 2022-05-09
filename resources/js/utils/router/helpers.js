export function splitNestedKeys(key, keyChain = []) {
    return (key || "").split(".").map((path) => {
        keyChain.push(path);
        return keyChain.join(".");
    });
}
