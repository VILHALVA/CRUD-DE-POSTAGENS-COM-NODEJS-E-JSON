const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const fs = require('fs');

// Configuração do Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));
app.set('view engine', 'handlebars');

// Configuração do Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota para exibir a lista de posts
app.get('/', function(req, res) {
  fs.readFile('posts.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler arquivo de posts:', err);
      return res.status(500).send('Erro ao ler posts');
    }
    const posts = JSON.parse(data);
    res.render('home', { posts: posts });
  });
});

app.get('/cad', function(req, res){
  res.render("FORMULARIO");
});

// Rota para processar o formulário
app.post('/cad', function(req, res){
  fs.readFile('posts.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler arquivo de posts:', err);
      return res.status(500).send('Erro ao ler posts');
    }
    const posts = JSON.parse(data);
    const newPost = {
      id: posts.length + 1, // Gera um ID simples
      titulo: req.body.titulo,
      conteudo: req.body.conteudo
    };
    posts.push(newPost);
    fs.writeFile('posts.json', JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        console.error('Erro ao escrever arquivo de posts:', err);
        return res.status(500).send('Erro ao salvar post');
      }
      res.redirect('/');
    });
  });
});

// Rota para editar postagem
app.get('/edit/:id', function(req, res){
  const postId = parseInt(req.params.id);

  fs.readFile('posts.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler arquivo de posts:', err);
      return res.status(500).send('Erro ao ler posts');
    }
    const posts = JSON.parse(data);
    const post = posts.find(post => post.id === postId);
    if (!post) {
      return res.send('Post não encontrado!');
    }
    res.render('form-edit', {
      id: post.id,
      titulo: post.titulo,
      conteudo: post.conteudo
    });
  });
});

app.post('/editado/:id', function(req, res){
  const postId = parseInt(req.params.id);

  fs.readFile('posts.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler arquivo de posts:', err);
      return res.status(500).send('Erro ao ler posts');
    }
    let posts = JSON.parse(data);
    const index = posts.findIndex(post => post.id === postId);
    if (index === -1) {
      return res.send('Post não encontrado!');
    }
    posts[index] = {
      id: postId,
      titulo: req.body.titulo,
      conteudo: req.body.conteudo
    };
    fs.writeFile('posts.json', JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        console.error('Erro ao escrever arquivo de posts:', err);
        return res.status(500).send('Erro ao editar post');
      }
      res.redirect('/');
    });
  });
});


// Rota para excluir postagem
app.get('/deletar/:id', function(req, res) {
  const postId = parseInt(req.params.id);

  fs.readFile('posts.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler arquivo de posts:', err);
      return res.status(500).send('Erro ao ler posts');
    }
    let posts = JSON.parse(data);
    posts = posts.filter(post => post.id !== postId);
    fs.writeFile('posts.json', JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        console.error('Erro ao escrever arquivo de posts:', err);
        return res.status(500).send('Erro ao deletar post');
      }
      res.send("POSTAGEM DELETADA COM SUCESSO!");
    });
  });
});

// Inicie o servidor
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
