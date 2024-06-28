const url = 'https://williamform.azurewebsites.net/'

export const SendFormAPI = async (form: IForm) => {
    const res = await fetch(url + 'Form/AddForm', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(form)
    })
    if(!res.ok){
        const message = "An error message has occured"
        throw new Error(message)
    }
    const data = res.json();
    return data
}

export const GetFormsAPI = async () => {
    const promise = await fetch(url + 'Form/GetForm');
    const data: IForm[] = await promise.json();
    return data;
}

