const createFakeApi = () => {
    let _id = 0;
    const createNote = () => new Promise(resolve => setTimeout(() => {
        _id++
        resolve({
            id: `${_id}`
        })
    }, 1000));
    return {
        createNote
    };
};

export const api = createFakeApi();