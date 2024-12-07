const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Rutas CRUD
app.get('/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) return res.status(500).json({ error: err })
    res.json(results)
  })
})

app.post('/items', (req, res) => {
  const { name, description } = req.body

  db.query(
    'INSERT INTO items (name, description) VALUES (?, ?)',
    [name, description],
    (err) => {
      if (err) {
        console.error('Error al insertar:', err) // Log del error
        return res.status(500).json({ error: 'Error al insertar el ítem' })
      }
      res.status(201).json({ message: 'Item creado' })
    }
  )
})

app.put('/items/:id', (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  db.query(
    'UPDATE items SET name = ?, description = ? WHERE id = ?',
    [name, description, id],
    (err) => {
      if (err) return res.status(500).json({ error: err })
      res.json({ message: 'Item actualizado' })
    }
  )
})

app.delete('/items/:id', (req, res) => {
  const { id } = req.params
  db.query('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err })
    res.json({ message: 'Item eliminado' })
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
