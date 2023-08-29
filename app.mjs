import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'
//import { config as dotenvConfig } from 'dotenv';

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

servidor.post('/', async (req, resp) => {
  const con = mysql.createConnection({
    host: req.body.servidor,
    database: req.body.banco,
    user: req.body.usuario,
    password: req.body.senha
  });

  const desconectado = await new Promise(resolve=>{
    con.ping(erro=>resolve(erro));
  });
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

servidor.get('/usuarios', async (req, resp)=>{
  resp.json({usuarios: [{nome: 'Nome1'},{nome: 'Nome2'},{nome: 'Nome3'}]});
});

servidor.listen(3333, ()=>console.log('iniciou server, ouvindo porta 3333'));