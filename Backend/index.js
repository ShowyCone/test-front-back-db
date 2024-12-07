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

app.post('/items', async (req, res) => {
  const { content } = req.body
  if (!content) {
    return res.status(400).json({ error: 'Content is required' })
  }

  try {
    // Obtenemos el último item basado en el campo 'name'
    const [lastItem] = await pool.execute(
      'SELECT * FROM items ORDER BY name DESC LIMIT 1'
    )

    let nextNumber = 1 // Default a 1 si no hay items en la base de datos

    if (lastItem.length > 0) {
      // Extraemos el número del último 'name' (Ejemplo: "Item 5")
      const lastName = lastItem[0].name
      const match = lastName.match(/Item (\d+)/) // Extraemos el número con regex

      if (match && match[1]) {
        nextNumber = parseInt(match[1]) + 1 // Incrementamos el número
      }
    }

    const name = `Item ${nextNumber}` // Asignamos el nombre "Item x"

    // Insertamos el nuevo item con el nombre calculado
    const [result] = await pool.execute(
      'INSERT INTO items (name, description) VALUES (?, ?)',
      [name, content]
    )

    // Obtenemos el nuevo item para devolverlo en la respuesta
    const [newItem] = await pool.execute('SELECT * FROM items WHERE id = ?', [
      result.insertId,
    ])

    res.status(201).json(newItem[0])
  } catch (error) {
    console.error('Error al agregar el item', error)
    res.status(500).json({ error: 'Error al agregar el item' })
  }
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
