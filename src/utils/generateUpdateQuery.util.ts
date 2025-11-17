export function generateUpdateQuery(
    tableName: string,
    updateFields: Record<string, string | number | undefined>,
    conditionField: string,
    conditionValue: string | number
) {
    const params = [];
    const setClause: string[] = [];

    let count = 1; // using this variable to keep track of fields that are undefined, the loop's index includes them.

    Object.entries(updateFields).forEach((setExpression) => {
        const [columnName, param] = setExpression;
        if (param) {
            const placeHolderIndex = `$${count++}`;
            setClause.push(`${columnName} = ${placeHolderIndex}`);
            params.push(param);
        }
    });

    params.push(conditionValue);

    let query = `UPDATE ${tableName} SET `;
    query += `${setClause.join(', ')} WHERE ${conditionField} = $${count++} RETURNING *`;

    return { query, params };
}
