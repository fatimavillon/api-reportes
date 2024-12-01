const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const validateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Obtener el token del header (Bearer token)
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const tenantId = req.headers['tenant_id'];  // Usar tenant_id de los headers o como parámetro

    // Verificar en DynamoDB si el token es válido
    const params = {
      TableName: process.env.AUTH_TOKENS_TABLE,  // Tabla de tokens
      Key: {
        tenant_id: tenantId,  // Usamos tenant_id del token
        token: token           // Usamos el token como clave de rango
      }
    };

    const result = await dynamoDB.get(params).promise();

    // Si no existe el token en la base de datos, rechazamos la solicitud
    if (!result.Item) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Si el token es válido, asignamos el user_id a req.user
    req.user = { user_id: result.Item.user_id, tenant_id: result.Item.tenant_id };

    next();  // Pasamos al siguiente middleware o función

  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Token inválido o error en la validación' });
  }
};

module.exports = { validateToken };
