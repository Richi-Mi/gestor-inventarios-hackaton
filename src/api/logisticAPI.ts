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

export const doCreateProduct = (data: any) => {
    return doPOSTRequest('/producto', data);
}

export const getProducts = () => {
    return doGETRequest('/producto');
}

export const updateProductInventories = (data: any) => {
    return doPOSTRequest('/producto/updateInventory', data, 'PUT');
}


export const promptProductRecommendation = async () => {
    const products: any = await getProducts()
    const list = Array.isArray(products) ? products : (products?.data ?? products?.products ?? [])

    let tiendaId: any = null
    try {
        const raw = localStorage.getItem('empleado')
        if (raw) {
            const parsed = JSON.parse(raw)
            tiendaId = parsed.tienda ?? parsed.sucursalId ?? null
        }
    } catch {}

    let localInv: Record<string, number> = {}
    if (tiendaId) {
        try {
            const rawInv = localStorage.getItem(`inventario_${tiendaId}`)
            if (rawInv) localInv = JSON.parse(rawInv)
        } catch {}
    }

    const normalized = list.map((p: any) => {
        const id = p.id ?? p.nombreModelo
        const ventas = p.ventas ?? p.VENTAS ?? p.PREDICCION_PZS ?? p.sold ?? null
        const precio = Array.isArray(p.skus) ? p.skus[0]?.precioVenta : p.skus?.precioVenta
        return {
            id,
            nombreModelo: p.nombreModelo,
            marca: p.marca,
            categoria: p.categoria,
            precio: precio ?? null,
            ventas: ventas ?? null,
            inventory: Number(localInv[id] ?? p.stock ?? p.inventory ?? p.cantidad ?? 0)
        }
    })

    const prompt = `Eres un asistente experto en visual merchandising y ventas para tiendas físicas. A continuación tienes una lista de productos con sus campos:\n` +
        `${JSON.stringify(normalized, null, 2)}\n\n` +
        `Analiza los datos y responde en TEXTO claro, conciso y humano (sin JSON ni estructuras). Indica cuáles productos se recomiendan para sacar al mostrador y por qué (prioriza rotación y stock suficiente). Puedes enumerar hasta 8 productos mencionando su id o nombreModelo. La respuesta debe ser legible para un gerente de tienda y no contener código ni JSON.`

    return doPOSTRequest('/producto/prompt', { prompt, products: normalized })
}
