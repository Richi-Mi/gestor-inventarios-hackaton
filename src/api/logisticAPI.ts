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

const doPOSTRequest = async (endpoint : string, data: any, method: string = 'POST') => {
    const req = await fetch(`${BASE_URL}${endpoint}`, {
        method,
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
export const doLogin = (data: any) => {
    return doPOSTRequest('/user/', data, 'PUT');
}

// Crear un nuevo producto/modelo con su SKU inicial
export const doCreateProduct = (data: any) => {
    // Asumimos el endpoint /product; si tu API usa otro, ajusta aquí
    return doPOSTRequest('/producto', data);
}

export const getProducts = () => {
    // GET list of products
    return doGETRequest('/producto');
}

// Actualizar inventarios en bloque. Payload esperado: [{ productId, skuId?, inventory }]
export const updateProductInventories = (data: any) => {
    console.log(data);
    
    // Ajusta el endpoint según tu API real    
    return doPOSTRequest('/producto/updateInventory', data, 'PUT');
}