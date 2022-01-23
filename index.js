const Joi = require('joi');
const express = require('express')
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const PORT = process.env.PORT || 8080;

app.use(express.json())

const courses = [
    { id: 1, name: 'course name 1' },
    { id: 2, name: 'course name 2' },
    { id: 3, name: 'course name 3' }
]

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Template swagger documentation",
            version: "0.1.0",
            description: "Express API documentation",
        },
        server: [
            {
                url: "http://localhost:8080"
            }
        ]  
    },
    apis: ["index.js"] 
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: the book title
 *         author:
 *           type: string
 *           description: the book title
 *       example:
 *         id: jlsad
 *         title: The new touring omnibus 
 *         author: Alexander K.
 */

app.get('/', (req, res) => {
    res.send('Server is working ...');
})

 /**
  * @swagger
  * /api/courses:
  *   get:
  *     summery: Return a list with all the courses available
  *     responses:
  *       200:
  *         description: The list of the courses
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  */
app.get('/api/courses', (req, res) => {
    res.send(courses);
})


app.get('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('This course was not found!');
    res.send(course)
    
})

app.post('/api/courses', (req, res) => {
    const schema = Joi.object({ 
        name: Joi.string().min(3).required()
        // email: Joi.string() .min(6) .required() .email(),
        // password: Joi.string() .min(6) .required() 
    });
        
    const validation = schema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error)
    let course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(validation);
})

app.put('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('This course was not found!');

    const schema = Joi.object({ 
        name: Joi.string().min(3).required()
    });

    const validation = schema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error)
    console.log(course.name)

    course.name = req.body.name;
    res.send(course);
})


app.delete('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('This course was not found!')

    // Delete
    let index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})


app.listen(
    PORT,
    () => console.log(`Listening on port ${PORT}`)
)
