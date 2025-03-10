import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const porta = 3000;
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const query = "select * from artigo";
    const d = new Date();

    try {
        const resposta = await pool.query(query);
        res.render("index.ejs", { artigos: resposta.rows });
    }

    catch (erro) { console.error(erro); }
});

app.post("/criarArtigo", async (req, res) => {
    const { titulo, texto, autor } = req.body;
    const query = `insert into artigo (autor,titulo,datac,conteudo) values ($1,$2,$3,$4)`;
    const d = new Date();
    const data = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay();
    try {
        await pool.query(query, [autor, titulo, data, texto]);
        res.redirect("/");
    }
    catch (erro) { console.error(erro); }
});

app.get("/abrirArtigo/:index", async (req, res) => {
    const query = "select * from artigo where id = $1";

    try {
        const resposta = await pool.query(query, [req.params.index]);
        res.render("texto.ejs", { artigo: resposta.rows[0] });
    }
    catch (erro) { console.error(erro); }
});

app.get("/removerArtigo/:index", async (req, res) => {
    const query = "delete from artigo where id = $1";

    try {
        await pool.query(query, [req.params.index]);
        res.redirect("/");
    }

    catch (erro) { console.error(erro); }

});

app.post("/editarArtigo/:index", async (req, res) => {
    const { titulo, texto, autor } = req.body;
    const d = new Date();
    const data = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay();
    const query = "update artigo set titulo = $1 ,conteudo = $2, datac = $3, autor = $4 where id = $5";

    try{
       await pool.query(query,[titulo,texto,data,autor,req.params.index]);
       res.redirect(`/abrirArtigo/${req.params.index}`);
    }

    catch(erro){console.log(erro);}
});


app.listen(porta, (req, res) => { console.log("Servidor rodando na porta " + porta); });
