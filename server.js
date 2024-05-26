
const express = require('express');
const path = require('path');

const mongoose = require('mongoose');

const methodOverride = require('method-override');

const { constants } = require('buffer');

mongoose.connect('mongodb://localhost:27017/node-block', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const formatDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0]; 
};
// Tasks Schema and Model
const PostsSchema = new mongoose.Schema({    
    text: String,
    title: String,
    author: String,
    date: {
        type: String,  // Використання типу String для зберігання дати у форматі YYYY-MM-DD
        default: formatDate
    }
});
const Post = mongoose.model('posts', PostsSchema);


const ContactsSchema = new mongoose.Schema({    
    name: String,
    url: String,    
});
const Contacts = mongoose.model('contacts', ContactsSchema);

const app = express();

app.set('view enginer', 'ejs')

const PORT = 3000;

// Функція для створення абсолютного шляху до файлу
const createPath = (page) => path.resolve(__dirname, 'views', `${page}.ejs`);


app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
});

app.use((req,res, next)=>{
    console.log(req.url)
    console.log(req.method)
    next();
})

app.use(express.urlencoded({extended:false}))

app.use(methodOverride('_method'));

app.use(express.static('styles'))

app.get('/', (req, res) => {
    title = "Home";
    res.render(createPath('index'), {title});
});

app.get('/about', (req, res) => {
    res.redirect('/contacts');
});

app.get('/contacts', (req, res) => {
    Contacts.find()
    .then(contacts=>  res.render(createPath('contacts'), {contacts, title}))
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error' });
    });
    title= "Contacts"
   
});

app.get('/posts/:id', (req, res) => {
    title= "Info"
    Post.findById(req.params.id)
    .then(post => {
        console.log(post);
        res.render(createPath('post'), { title, post });
    })
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error' });
    });
    
    //res.render(createPath('post'), {title, post});
});

app.get('/edit/:id', (req, res) => {
    title= "Edit Info"
    Post.findById(req.params.id)
    .then(post => {
        console.log(post);
        res.render(createPath('edit-post'), { title, post });
    })
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error' });
    });
    
    //res.render(createPath('post'), {title, post});
});

app.get('/posts', (req, res) => {
    const title = "Posts";
    Post.find()
    .sort({date:-1})
    .then(posts => {
        console.log(posts);
        res.render(createPath('posts'), { title, posts });
    })
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error' });
    });
});





app.post('/add-post', (req, res) => {
    const { title, author, text } = req.body;
    const post = new Post({ title, author, text });
    
    post.save()
        .then((result) => {
            res.redirect('/posts');
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.get('/add-post', (req, res) => {
    title= "add-post"
    res.render(createPath('add-post'), {title});
});

app.delete('/posts/:id', (req, res) => {
    title= "Info"
    Post.findByIdAndDelete(req.params.id)
    .then(result => {
        res.statusCode(200);
    })
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error' });
    });
    
    //res.render(createPath('post'), {title, post});
});

app.use((req, res)=>{
    title= "Error"
    res.statusCode = 404
    res.render(createPath('error'), {title})
})

