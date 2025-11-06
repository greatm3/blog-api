export function generateUpdateQuery(
    tableName: string,
    updateFields: Record<string, string | number>,
    conditionField: string,
    conditionValue: string | number
) {
    const params = [];
    const setClause: string[] = [];

    Object.entries(updateFields).forEach((setExpression, index) => {
        const [columnName, param] = setExpression;
        const placeHolderIndex = `$${index + 1}`;
        setClause.push(`${columnName} = ${placeHolderIndex}`);
        params.push(param);
    });

    params.push(conditionValue);

    let query = `UPDATE ${tableName} SET `;
    query += `${setClause.join(', ')} WHERE ${conditionField} = $${
        params.length
    }`;

    return { query, params };
}
