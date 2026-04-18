const oracledb = require('oracledb');

const dbConfig = {
  user: 'C##FARMER',
  password: 'farmer123',
  connectString: 'localhost/XE'
};

async function queryValue(connection, sql, binds = {}) {
  const result = await connection.execute(sql, binds);
  return result.rows[0][0];
}

async function main() {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const productResult = await connection.execute(`
      SELECT product_id, product_name, TO_CHAR(expiry_date, 'YYYY-MM-DD')
      FROM product
      ORDER BY product_id
      FETCH FIRST 1 ROWS ONLY
    `);

    if (!productResult.rows.length) {
      console.log('No products found to demo.');
      return;
    }

    const [productId, productName, originalExpiryDate] = productResult.rows[0];

    console.log('Expiry Date Update Demo');
    console.log('-----------------------');
    console.log(`Product: ${productName} (#${productId})`);
    console.log(`Original expiry date: ${originalExpiryDate}`);

    await connection.execute(
      `
        UPDATE product
        SET expiry_date = TRUNC(SYSDATE) - 1
        WHERE product_id = :product_id
      `,
      { product_id: productId },
      { autoCommit: true }
    );

    const expiredBefore = await queryValue(
      connection,
      `SELECT COUNT(*) FROM product WHERE expiry_date < TRUNC(SYSDATE)`
    );

    const forcedExpiredDate = await queryValue(
      connection,
      `
        SELECT TO_CHAR(expiry_date, 'YYYY-MM-DD')
        FROM product
        WHERE product_id = :product_id
      `,
      { product_id: productId }
    );

    console.log(`Forced expired date: ${forcedExpiredDate}`);
    console.log(`Expired products before fix: ${expiredBefore}`);

    const updateResult = await connection.execute(
      `
        UPDATE product
        SET expiry_date = TRUNC(SYSDATE) + 7
        WHERE expiry_date < TRUNC(SYSDATE)
      `,
      [],
      { autoCommit: true }
    );

    const expiredAfter = await queryValue(
      connection,
      `SELECT COUNT(*) FROM product WHERE expiry_date < TRUNC(SYSDATE)`
    );

    const updatedDate = await queryValue(
      connection,
      `
        SELECT TO_CHAR(expiry_date, 'YYYY-MM-DD')
        FROM product
        WHERE product_id = :product_id
      `,
      { product_id: productId }
    );

    console.log(`Rows updated by fix: ${updateResult.rowsAffected}`);
    console.log(`New expiry date: ${updatedDate}`);
    console.log(`Expired products after fix: ${expiredAfter}`);
    console.log('');
    console.log('Demo complete: expired products were moved to an upcoming date.');
  } catch (error) {
    console.error('Demo failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

main();
