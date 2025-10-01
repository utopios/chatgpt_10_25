const http = require('http');
const { URL } = require('url');

const products = new Map();
let nextId = 1;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

const sendJson = (res, status, payload) => {
  if (status === 204) {
    res.writeHead(status);
    res.end();
    return;
  }
  res.writeHead(status, JSON_HEADERS);
  if (payload === undefined) {
    res.end();
    return;
  }
  res.end(JSON.stringify(payload));
};

const readJson = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    if (!chunks.length) {
      resolve({});
      return;
    }
    try {
      const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      resolve(parsed);
    } catch (err) {
      reject(new Error('INVALID_JSON'));
    }
  });
  req.on('error', reject);
});

const validateProductPayload = (body, { partial } = {}) => {
  if (!partial && typeof body.name !== 'string') {
    return 'name is required';
  }
  if (!partial && typeof body.price !== 'number') {
    return 'price is required and must be a number';
  }
  if (body.name !== undefined && typeof body.name !== 'string') {
    return 'name must be a string';
  }
  if (body.price !== undefined && typeof body.price !== 'number') {
    return 'price must be a number';
  }
  if (
    body.stock !== undefined &&
    (typeof body.stock !== 'number' || Number.isNaN(body.stock) || !Number.isFinite(body.stock))
  ) {
    return 'stock must be a finite number';
  }
  if (
    body.tags !== undefined &&
    (!Array.isArray(body.tags) || body.tags.some((tag) => typeof tag !== 'string'))
  ) {
    return 'tags must be an array of strings';
  }
  return null;
};

const serializeProduct = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  stock: product.stock,
  tags: product.tags.slice(0),
});

const getProduct = (id) => products.get(id);

const createProduct = (payload) => {
  const id = String(nextId++);
  const product = {
    id,
    name: payload.name,
    price: payload.price,
    stock: payload.stock ?? 0,
    tags: Array.isArray(payload.tags) ? payload.tags.slice(0, 16) : [],
  };
  products.set(id, product);
  return product;
};

const updateProduct = (id, payload, { partial } = {}) => {
  const existing = getProduct(id);
  if (!existing) {
    return null;
  }
  if (partial) {
    if (payload.name !== undefined) existing.name = payload.name;
    if (payload.price !== undefined) existing.price = payload.price;
    if (payload.stock !== undefined) existing.stock = payload.stock;
    if (payload.tags !== undefined) {
      existing.tags = payload.tags.slice(0, 16);
    }
    return existing;
  }
  existing.name = payload.name;
  existing.price = payload.price;
  existing.stock = payload.stock ?? 0;
  existing.tags = Array.isArray(payload.tags) ? payload.tags.slice(0, 16) : [];
  return existing;
};

const deleteProduct = (id) => products.delete(id);

const parseId = (segment) => {
  if (!segment) return null;
  return /^[0-9]+$/.test(segment) ? segment : null;
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const segments = url.pathname.split('/').filter(Boolean);

    if (!segments.length || segments[0] !== 'products') {
      sendJson(res, 404, { error: 'Not Found' });
      return;
    }

    const id = parseId(segments[1]);

    if (!id && segments.length > 1) {
      sendJson(res, 400, { error: 'Invalid product id' });
      return;
    }

    if (req.method === 'GET' && !id) {
      const list = Array.from(products.values(), serializeProduct);
      sendJson(res, 200, { items: list });
      return;
    }

    if (req.method === 'POST' && !id) {
      const body = await readJson(req);
      const validationError = validateProductPayload(body, { partial: false });
      if (validationError) {
        sendJson(res, 422, { error: validationError });
        return;
      }
      const product = createProduct(body);
      sendJson(res, 201, serializeProduct(product));
      return;
    }

    if (!id) {
      sendJson(res, 405, { error: 'Method Not Allowed' });
      return;
    }

    if (req.method === 'GET') {
      const product = getProduct(id);
      if (!product) {
        sendJson(res, 404, { error: 'Product not found' });
        return;
      }
      sendJson(res, 200, serializeProduct(product));
      return;
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = await readJson(req);
      const validationError = validateProductPayload(body, { partial: req.method === 'PATCH' });
      if (validationError) {
        sendJson(res, 422, { error: validationError });
        return;
      }
      const product = updateProduct(id, body, { partial: req.method === 'PATCH' });
      if (!product) {
        sendJson(res, 404, { error: 'Product not found' });
        return;
      }
      sendJson(res, 200, serializeProduct(product));
      return;
    }

    if (req.method === 'DELETE') {
      const deleted = deleteProduct(id);
      if (!deleted) {
        sendJson(res, 404, { error: 'Product not found' });
        return;
      }
      sendJson(res, 204);
      return;
    }

    sendJson(res, 405, { error: 'Method Not Allowed' });
  } catch (err) {
    if (err && err.message === 'INVALID_JSON') {
      sendJson(res, 400, { error: 'Invalid JSON payload' });
      return;
    }
    sendJson(res, 500, { error: 'Internal Server Error' });
  }
});

const listen = (port = process.env.PORT || 3000, host = '0.0.0.0') => new Promise((resolve) => {
  server.listen(port, host, () => resolve({ port, host }));
});

const reset = () => {
  products.clear();
  nextId = 1;
};

module.exports = {
  server,
  listen,
  reset,
  products,
};

if (require.main === module) {
  listen().then(({ port, host }) => {
    console.log(`Product API listening on http://${host}:${port}`);
  });
}
