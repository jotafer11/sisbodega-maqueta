const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '12345',
    database: 'kardextaller_db',
    port: '5432'
});

const getGrupos = async (req, res) => {
    const response = await pool.query('SELECT * FROM grupos');
    res.status(200).json(response.rows);
};

const createGrupo = async (req, res) => {
    const { id, nombre } = req.body;

    const response = await pool.query('INSERT INTO grupos (id, nombre) VALUES ($1, $2)', [id, nombre]);
    console.log(response);
    res.json({
        message: 'Grupo added Succefuly',
        body: {
            grupo: {id, nombre}
        }
    })
    res.send('grupo created');
}; 

const updateGrupo = async (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    console.log(id, nombre);
    res.send('Grupo Updated');
};   

const getGrupoById = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM grupos where id = $1', [id])
    res.json(response.rows);
}

const deleteGrupo = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM grupos WHERE id = $1', [id]);
    console.log(response);
    res.json(`Grupo ${id} deleted succefully`);
}; 


module.exports = {
    getGrupos,
    getGrupoById,
    createGrupo,
    deleteGrupo,
    updateGrupo
}