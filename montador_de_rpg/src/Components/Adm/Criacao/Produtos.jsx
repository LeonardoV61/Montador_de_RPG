import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../Css/styles.CriaT.module.css'

export default function CriaProd() {
    const [file, setFile] = useState(null)
    const [fechar, setFechar] = useState(false)
    const [subcategoria, setSubcategoria] = useState(null)
    const [subSelecionada, setSubSelecionada] = useState([])
    const [criando, setCriando] = useState(false)

    useEffect(() => {
        fetch('https://back-end-barbalao.onrender.com/api/categoria/')
        .then(res => res.json())
        .then(data => {
            console.log("Resposta da API sub:", data)
            setSubcategoria(data)
        })
        .catch(err => {
            console.error(`Erro ao carregar categorias: ${err}`)
        })
    }, [])

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }


    const handleSub = (e) => {
        e.preventDefault()

        if (criando) return

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        setCriando(true)
        console.log("Dados do form:", data); 

        if(file){
            const leitor = new FileReader()
            leitor.onload = (ev) => {

                data.imagem = ev.target.result

                const payload = {
                    nome: data.nome,
                    preco: data.preco,
                    descricao: data.descricao,
                    imagem: data.imagem,
                    categoria: subSelecionada
                    // usuario: localStorage.getItem('id_user')
                }
                
                fetch('https://back-end-barbalao.onrender.com/api/products/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                })
                    .then((res) =>{

                        if (!res.ok) {
                            return res.json().then((err) => {
                                throw new Error(err.message || 'Falha ao criar produto');
                            });
                        }
                        return res.json();
                    })
                    .then((json) => {
                        alert(`Produto criado (id: ${json.ID})`)
                        e.target.reset()
                        setFile(null)
                        setCriando(false)
                        location.reload()
                    })
                    .catch((err) => {
                        alert(`Erro: ${err.message}`)
                        setCriando(false)
                        location.reload()
                    })

            }
            leitor.readAsDataURL(file)
        }
        

    }

    if (fechar) {
        return null
    }

    return(
        <>
          <div className={`${styles.background } `}>
            <div className={styles.formContainer}>
                <button className={styles.backButton}
                    onClick={() => setFechar(true)}
                >+</button>
                <h1>PRODUTO</h1>
                <form className={styles.form} onSubmit={handleSub}>

                    <label className={styles.label} htmlFor="nome">Nome:</label>
                    <input className={styles.input} 
                        type="text" 
                        name="nome" 
                        id="nome" 
                        required 
                    />

                    <label className={styles.label} htmlFor="preco">Preço:</label>
                    <input className={styles.input} 
                        type="number" 
                        name="preco" 
                        id="preco" 
                        min={1.0} 
                        step={0.01}
                    />

                    <label htmlFor="descricao">Descrição: </label>
                    <textarea name="descricao" id="descricao"></textarea>

                    <label className={styles.label} htmlFor="imagem">Imagem:</label>
                    <input className={styles.inputFile} 
                        type="file" 
                        name="imagem" 
                        id="imagem" 
                        accept="image/*"
                        onChange={handleFileChange} 
                        required
                    />

                    <div>
                        <label htmlFor="" className={styles.label}>Referente a:</label>
                        <select 
                            className={styles.input}
                            name="categoria" 
                            id="categoria"
                            value={subSelecionada}
                            onChange={(e) => {setSubSelecionada(e.target.value)}}
                            disabled={(subcategoria == null) || (subcategoria.length === 0)}
                            required
                        >
                            {subcategoria? 
                                <>
                                    <option value="">Selecione uma categoria</option>
                                    {subcategoria.map((categoria, i) => (
                                        <option key={i} value={categoria.id_categoria} >
                                            {categoria.nome}
                                        </option>
                                    ))}
                                </>
                                :
                                <option> Crie uma subcategoria</option>
                            }
                            
                        </select>
                    </div>
                    
                    <button className={styles.submitButton} type="submit" disabled={criando}>Criar</button>
                </form>
            </div>
            
            
         </div>
            
        </>
    )
} 