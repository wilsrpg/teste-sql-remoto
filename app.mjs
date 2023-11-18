import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'
//import { config as dotenvConfig } from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb'

//dotenvConfig();

const servidor = express();
servidor.use(express.json());
servidor.use(cors({
	//origin: 'http://meudominio.com'
}));
servidor.use(express.urlencoded({extended: false}));
//servidor.use(express.static('.'));

servidor.get('/', async (req, resp)=>{
  resp.sendFile('index.html', {root: '.'});
});

servidor.post('/mysql', async (req, resp) => {
  const con = mysql.createConnection({
    host: req.body.servidor.slice(0,req.body.servidor.search(':')),
    port: req.body.servidor.slice(req.body.servidor.search(':')),
    database: req.body.banco,
    user: req.body.usuario,
    password: req.body.senha
  });
  //console.log(con.config.host+':'+con.config.port);
  //console.log(con.config.database);
  //console.log(con.config.user);

  const desconectado = await new Promise(resolve=>{
    con.ping(erro=>resolve(erro));
  });
  console.log(desconectado);
  if(desconectado)
    return resp.sendFile('erro.html', {root: '.'});
  
  //con.connect(async (erro) => {
  //  if (erro)
  //    throw erro;
  //  con.query('SELECT * FROM `teste`;', (e,resultado,campos)=>{
  //    //console.log(resultado);
  //    return resolve(resultado[0].usuario);
  //  });
  //});
  //console.log(usuario);

  resp.sendFile('sucesso.html', {root: '.'});
});

servidor.post('/mongodb', async (req, resp) => {
  const uri = 'mongodb+srv://'+req.body.usuario+':'+req.body.senha+'@'+req.body.servidor+'/?retryWrites=true&w=majority';
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(erro) {
    console.log('Erro na conexão com o banco de dados: '+erro);
    return resp.sendFile('erro.html', {root: '.'});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  resp.sendFile('sucesso.html', {root: '.'});
});

servidor.get('/usuarios', async (req, resp)=>{
  resp.json({usuarios: [{nome: 'Nome1'},{nome: 'Nome2'},{nome: 'Nome3'}]});
});

servidor.listen(3333, ()=>console.log('iniciou server, ouvindo porta 3333'));