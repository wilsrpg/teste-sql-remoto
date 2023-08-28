import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import { config as dotenvConfig } from 'dotenv';

const servidor = express();
servidor.use(express.json());
servidor.use(cors({
	//origin: 'http://meudominio.com'
}));

dotenvConfig();

servidor.get('/', async (req, resp)=>{
  resp.send('deu certo!');
});

servidor.get('/usuarios', async (req, resp)=>{
  if(!process.env.HOST || !process.env.USUARIO || !process.env.SENHA || !process.env.BANCO)
    return resp.json("Dados de conexão com o banco de dados incompletos.");

  const connection = mysql.createConnection({
    host: process.env.HOST,
    //port: process.env.PORTA,
    user: process.env.USUARIO,
    password: process.env.SENHA,
    database: process.env.BANCO
  });

  let resultado;
  connection.connect(async (err) => {
    if (err) throw err;
    //console.log('Connected to the remote database!');
    connection.query('SELECT * FROM `teste`;', (e,r,campos)=>{
      //console.log(r[0].usuario);
      resultado = r;
      //console.log(campos);
      //exit();
    });
  });

	//const db = await abrirBanco;
	//const jogos = await db.all(`SELECT * FROM Jogos;`);
	//console.log("GET jogos, qtde="+jogos.length+", ip="+req.ip);
	//const jogosQtde = await db.all(
	//	`SELECT Jogos.id, COUNT(Anuncios.jogoId) as qtdeAnuncios
	//	FROM Jogos LEFT JOIN Anuncios
	//	ON Jogos.id=Anuncios.jogoId
	//	GROUP BY Jogos.id;`
	//);
	//jogos.map(jogo=>jogo._count = {anuncios: jogosQtde.find(j=>j.id==jogo.id).qtdeAnuncios});
	return resp.json(resultado);
})

servidor.listen(
  process.env.PORTA_DO_SERVIDOR,
  ()=>console.log("iniciou server, ouvindo porta "+process.env.PORTA_DO_SERVIDOR)
);