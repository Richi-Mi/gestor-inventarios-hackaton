const BASE_URL = 'http://127.0.0.1:3000';

const doGETRequest = async (endpoint : string) => {
    const req =  await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    return await req.json();
}

const doPOSTRequest = async (endpoint : string, data: any) => {
    console.log(`${BASE_URL}${endpoint}`);
    console.log(data);
    

    const req = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await req.json();
}
export const getStores = () => {
    return doGETRequest('/user/tiendas');   
}
export const doRegister = (data: any) => {
    return doPOSTRequest('/user/', data);
}