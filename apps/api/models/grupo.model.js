import {db} from '../database/connection.database.js'

export const create = async ({ id, nombre }) => {

    const query = {
        text: `
            INSERT INTO grupos (id, nombre)
            VALUES ($1, $2)
            RETURNING id, nombre
        `,
        values: [id, nombre]
    }

    const { rows } = await db.query(query)

    return rows[0]
}

export const findOneById = async (id) => {

    const query = {
        text: `
            SELECT *
            FROM grupos
            WHERE id = $1
        `,
        values: [id]
    }

    const { rows } = await db.query(query)

    return rows[0]
}


export const GrupoModel = {
    create,
    findOneById
}