const pool = require('../db');
const authorization = require('../middleware/authorization');

const router = require('express').Router();

//get all todos and name from user table and todos table based on the user_id
router.get('/', authorization, async (req, res) => {
    try {
        const userData = await pool.query('SELECT * FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE u.user_id=$1', [req.user]);
        return res.status(200).json(userData.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json('server error');
    }
});


//Insert Todos 
router.post('/todos', authorization, async (req, res) => {
    try {
        const { description } = req.body;
        console.log(description + '=' + req.user);
        const addData = await pool.query('INSERT INTO todos(user_id,description) VALUES ($1,$2) RETURNING *', [req.user, description]);
        return res.json(addData.rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Error');
    }
});

//Update Todos
router.put('/todos/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.body);
        const { description } = req.body;
        console.log(description + '' + id);
        const updateData = await pool.query('UPDATE todos SET description=$1 WHERE todo_id=$2 AND user_id=$3 RETURNING *', [description, id, req.user]);

        if (updateData.rows.length === 0) {
            return res.json(`you can't able to update this todo`);
        }
        return res.json('Todo was updated');

    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Error');
    }
});

//Delete Todos
router.delete('/todos/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query('DELETE FROM todos WHERE todo_id=$1 AND user_id=$2 RETURNING *', [id, req.user]);

        if (deleteTodo.rows.length === 0) {
            return res.json('You cannot able to delete this todo');
        }
        return res.json('Todo was deleted');
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Error');
    }
})

module.exports = router;