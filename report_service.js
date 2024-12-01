const AWS = require('aws-sdk');
const { queryOrders } = require('../models/orders_model'); // Nuevo modelo para consultar pedidos
const { createReport } = require('../models/report_model');
const dynamoDB = new AWS.DynamoDB.DocumentClient();


const generateSalesReport = async (tenantId) => {
  const orders = await queryOrders(tenantId);

  let totalSales = 0;
  let totalItems = 0;

  orders.forEach(order => {
    order.items.forEach(item => {
      totalSales += item.price;
      totalItems += 1; 
    });
  });

  const report = {
    tenant_id: tenantId,
    report_id: `report_${Date.now()}`,
    created_at: new Date().toISOString(),
    data: {
      total_sales: totalSales,
      total_items: totalItems,
    },
  };

  // Guardar el reporte en DynamoDB
  await createReport(report);

  return report;
};

const listSalesReports = async (tenantId) => {
  const params = {
    TableName: process.env.TABLE_NAME,  // La tabla de reportes
    KeyConditionExpression: 'tenant_id = :tenant_id', 
    ExpressionAttributeValues: {
      ':tenant_id': tenantId
    },
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return result.Items;
  } catch (error) {
    console.error('Error consultando reportes:', error);
    throw new Error('Error al obtener los reportes de ventas');
  }
};


module.exports = { generateSalesReport, listSalesReports };
